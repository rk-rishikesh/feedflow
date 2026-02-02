import { NextResponse } from 'next/server';
import { FlattenRepoRequest, FlattenRepoResponse, GitHubTreeItem, DEFAULT_CONFIG } from '@/types/github-flattener';

export async function POST(req: Request) {
    try {
        const body: FlattenRepoRequest = await req.json();
        const { repoUrl, githubToken, branch = 'main', format = 'markdown' } = body;

        if (!repoUrl) {
            return NextResponse.json({ error: 'Repository URL is required' }, { status: 400 });
        }

        // Parse GitHub URL
        const urlMatch = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!urlMatch) {
            return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 });
        }

        const [_, owner, repoName] = urlMatch;
        const repo = repoName.replace(/\.git$/, '');

        // Fetch repository tree recursively
        const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
        const headers: Record<string, string> = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'FeedFlow-App'
        };

        if (githubToken) {
            headers['Authorization'] = `token ${githubToken}`;
        } else if (process.env.GITHUB_TOKEN) {
            headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
        }

        const treeRes = await fetch(treeUrl, { headers });
        if (!treeRes.ok) {
            const errData = await treeRes.json();
            return NextResponse.json({ error: `GitHub API error: ${errData.message || treeRes.statusText}` }, { status: treeRes.status });
        }

        const treeData = await treeRes.json();
        const items: GitHubTreeItem[] = treeData.tree;

        let combinedContent = '';
        let totalFiles = 0;
        let totalSize = 0;
        let totalCharacters = 0;
        const fileTypes: Record<string, number> = {};
        const processedFiles: any[] = [];

        // Filter and process files
        for (const item of items) {
            if (item.type !== 'blob' || !item.path) continue;

            const extension = `.${item.path.split('.').pop()}`;

            // Check if it's an allowed extension and not in ignore patterns
            const isAllowed = DEFAULT_CONFIG.allowedExtensions.some(ext => item.path?.endsWith(ext));
            const isIgnored = DEFAULT_CONFIG.ignorePatterns.some(pattern => item.path?.includes(pattern));

            if (isAllowed && !isIgnored && item.size && item.size < DEFAULT_CONFIG.maxFileSize) {
                // Fetch file content
                const fileRes = await fetch(item.url!, { headers });
                if (fileRes.ok) {
                    const fileData = await fileRes.json();
                    const content = Buffer.from(fileData.content, 'base64').toString('utf8');

                    if (format === 'markdown') {
                        combinedContent += `\n\n--- FILE: ${item.path} ---\n\n\`\`\`${extension.slice(1)}\n${content}\n\`\`\``;
                    } else {
                        combinedContent += `<file path="${item.path}">\n${content}\n</file>\n`;
                    }

                    totalFiles++;
                    totalSize += item.size;
                    totalCharacters += content.length;
                    fileTypes[extension] = (fileTypes[extension] || 0) + 1;
                    processedFiles.push({ path: item.path, size: item.size });
                }
            }
        }

        const response: FlattenRepoResponse = {
            success: true,
            content: combinedContent,
            stats: {
                totalFiles,
                totalSize,
                totalCharacters,
                fileTypes,
                repository: `${owner}/${repo}`,
                branch
            },
            files: processedFiles
        };

        return NextResponse.json(response);

    } catch (error: any) {
        console.error('Flatten Repo Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}