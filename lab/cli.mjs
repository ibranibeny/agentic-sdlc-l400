import { readFile, writeFile } from 'node:fs/promises';
import { route, simulate, validateEvidence } from './policy.mjs';

try {
  const [command, ...args] = process.argv.slice(2);
  if (command === 'route') {
    console.log(JSON.stringify(route(args), null, 2));
  } else if (command === 'simulate' || command === 'verify') {
    const allowed = command === 'simulate' ? ['--risk', '--sha', '--out'] : ['--risk', '--sha', '--file'];
    const options = {};
    for (let i = 0; i < args.length; i++) {
      const key = args[i];
      if (key === '--production' && command === 'verify') {
        if (options.production) throw new Error('Duplicate --production.');
        options.production = true;
      } else {
        if (!allowed.includes(key) || !args[i + 1] || args[i + 1].startsWith('--')) {
          throw new Error(`Unknown option or missing value: ${key}`);
        }
        if (Object.hasOwn(options, key)) throw new Error(`Duplicate option: ${key}`);
        options[key] = args[++i];
      }
    }
    if (command === 'simulate') {
      if (!options['--out']) throw new Error('Provide --out FILE.');
      await writeFile(options['--out'], JSON.stringify(simulate(options['--risk'], options['--sha']), null, 2));
      console.log('LAB ONLY: synthetic fixtures written; no AI agents executed.');
    } else {
      if (!options['--file']) throw new Error('Provide --file FILE.');
      const reports = JSON.parse(await readFile(options['--file'], 'utf8'));
      const result = validateEvidence({
        risk: options['--risk'], sha: options['--sha'], reports, production: options.production
      });
      console.log(options.production ? 'STRUCTURAL VALIDATION; AUTHENTICITY NOT VERIFIED' : 'LAB ONLY');
      console.log(JSON.stringify(result, null, 2));
      if (!result.ok) process.exitCode = 1;
    }
  } else {
    throw new Error('Usage: lab route PATH... | simulate --risk RISK --sha SHA --out FILE | verify --risk RISK --sha SHA --file FILE [--production]');
  }
} catch (error) {
  console.error(`Lab error: ${error.message}`);
  process.exitCode = 1;
}
