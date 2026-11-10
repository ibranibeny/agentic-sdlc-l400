import { computeScenario, scenarios, failures, stages } from './lab/scenario.mjs';

const byId = id => document.getElementById(id);
let step = 0;
let timer;
let result;

for (const [value, scenario] of Object.entries(scenarios)) {
  byId('scenario').add(new Option(scenario.label, value));
}
for (const [value, label] of Object.entries(failures)) byId('failure').add(new Option(label, value));
byId('scenario').value = 'api';

function stop() {
  clearInterval(timer);
  timer = undefined;
  byId('play').textContent = 'Play journey';
}

function render() {
  result = computeScenario({
    scenario: byId('scenario').value,
    failure: byId('failure').value,
    production: byId('production').checked
  });
  document.querySelectorAll('[data-stage]').forEach(node => {
    const index = Number(node.dataset.stage);
    node.classList.toggle('is-active', index === step);
    node.classList.toggle('is-complete', index < step);
    node.setAttribute('aria-current', index === step ? 'step' : 'false');
  });
  document.querySelectorAll('[data-edge]').forEach(edge =>
    edge.classList.toggle('is-active', Number(edge.dataset.edge) === step && step < 5));
  byId('stage-title').textContent = stages[step].label;
  byId('stage-detail').textContent = stages[step].detail;
  byId('route-result').textContent = `${result.plan.risk.toUpperCase()} / ${result.plan.reviewers.length} required reviewers`;
  byId('sha-result').textContent = result.expectedSha.slice(0, 12);
  byId('failure-result').textContent = failures[result.failure];
  const evaluated = step >= 4;
  const verdict = !evaluated ? 'Awaiting validation step' :
    result.validation.ok ? 'LAB STRUCTURE PASS — NOT RELEASE APPROVAL' : 'BLOCKED — evidence rejected';
  byId('verdict').textContent = verdict;
  byId('verdict').dataset.verdict = !evaluated ? 'pending' : result.validation.ok ? 'pass' : 'blocked';
  byId('reviewer-grid').replaceChildren(...result.plan.reviewers.map(reviewer => {
    const element = document.createElement('span');
    const matches = result.reports.filter(report => report.reviewer === reviewer);
    const problems = result.validation.errors.some(error => error.includes(reviewer));
    element.textContent = `${reviewer}${step < 2 ? ' / planned' : problems && evaluated ? ' / issue' : ' / fixture'}`;
    element.className = problems && evaluated ? 'reviewer has-issue' : 'reviewer';
    element.dataset.reviewer = reviewer;
    if (matches.length !== 1 && evaluated) element.classList.add('has-issue');
    return element;
  }));
  const errors = evaluated ? result.validation.errors : [];
  byId('validation-errors').replaceChildren(...errors.map(error => {
    const item = document.createElement('li');
    item.textContent = error;
    return item;
  }));
  byId('lab-output').textContent = JSON.stringify(result, null, 2);
  byId('step').disabled = step === stages.length - 1;
  byId('run-result').disabled = step === stages.length - 1;
}

for (const id of ['scenario', 'failure', 'production']) byId(id).addEventListener('change', () => {
  stop(); step = 0; render();
});
byId('step').addEventListener('click', () => { stop(); step = Math.min(step + 1, 5); render(); });
byId('reset').addEventListener('click', () => { stop(); step = 0; render(); });
byId('run-result').addEventListener('click', () => { stop(); step = 5; render(); });
byId('play').addEventListener('click', () => {
  if (timer) { stop(); return; }
  if (step === 5) step = 0;
  render();
  byId('play').textContent = 'Pause journey';
  timer = setInterval(() => {
    step = Math.min(step + 1, 5);
    render();
    if (step === 5) stop();
  }, 1100);
});
render();
