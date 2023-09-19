// const [url] = process.argv.slice(2);

const url = 'https://github.com/42YerevanProjects/push_swap.git';
import nodegit from 'nodegit';

console.log(url);
nodegit.Clone(url, './push_swap');

process.exit(0);
