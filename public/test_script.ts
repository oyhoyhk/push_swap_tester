// const [url] = process.argv.slice(2);

const url = 'https://github.com/42YerevanProjects/push_swap.git';
import simpleGit from 'simple-git';

const git = simpleGit();

git.clone(url, 'push_swap', (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log('success');
});
