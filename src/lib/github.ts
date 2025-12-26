/**
 * Fetch pinned repositories from GitHub GraphQL API
 * Used to dynamically load pinned repos on the portfolio projects page
 */

interface GitHubRepo {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
  updatedAt: string;
}

export async function getPinnedRepos(limit: number = 6): Promise<GitHubRepo[]> {
  const token = import.meta.env.GITHUB_TOKEN;
  const username = import.meta.env.GITHUB_USERNAME;

  if (!token || !username) {
    console.warn('GitHub credentials not configured. Using fallback.');
    return [];
  }

  const query = `
    query($userName:String!) {
      user(login: $userName) {
        pinnedItems(first: ${limit}, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              stargazerCount
              primaryLanguage {
                name
              }
              updatedAt
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { userName: username }
      })
    });

    const data = await response.json();

    if (data.errors) {
      console.error('GitHub GraphQL Error:', data.errors);
      return [];
    }

    const repos = data.data?.user?.pinnedItems?.nodes || [];

    return repos.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      url: repo.url,
      stars: repo.stargazerCount,
      language: repo.primaryLanguage?.name,
      updatedAt: repo.updatedAt
    }));
  } catch (error) {
    console.error('Error fetching pinned repos:', error);
    return [];
  }
}
