import { FlattenRepoRequest, FlattenRepoResponse, GitHubTreeItem, DEFAULT_CONFIG } from '@/types/github-flattener';

export async function flattenRepo(body: FlattenRepoRequest): Promise<FlattenRepoResponse> {
    const { repoUrl, githubToken, branch = 'main', format = 'markdown' } = body;

    if (!repoUrl) {
        throw new Error('Repository URL is required');
    }

    // Parse GitHub URL
    const urlMatch = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!urlMatch) {
        throw new Error('Invalid GitHub URL');
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
        throw new Error(`GitHub API error: ${errData.message || treeRes.statusText}`);
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

    return {
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
}
