// Support GitHub Pages by setting basePath when deploying
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
let repo = '';
if (isGithubActions) {
  const [owner, name] = process.env.GITHUB_REPOSITORY.split('/');
  repo = `/${name}`;
}

export default {
  output: 'export',
  images: { unoptimized: true },
  basePath: process.env.BASE_PATH || repo,
  assetPrefix: process.env.BASE_PATH || repo ? `${process.env.BASE_PATH || repo}/` : undefined,
};
