/* ============================================================
   POLL COMPONENT
   assets/components/poll.component.js
   ============================================================ */

import { can } from '../permissions/permissions.js';
import { getCurrentUser } from '../services/auth.js';
import { gateOrCta } from './ui.js';

export function mount(containerId, poll){
  const container = document.getElementById(containerId);
  if(!container) return;

  let votedOptionId = null;

  function render(){
    const user = getCurrentUser();
    const canVote = can(user, 'VOTE');
    const totalVotes = poll.options.reduce((sum,o) => sum + o.votes, 0) || 1;
    const hasVoted = !!votedOptionId;

    container.innerHTML = `
      <div class="poll-block">
        <div class="poll-question">${poll.question}</div>
        <div class="poll-options">${poll.options.map(o => {
          const pct = Math.round((o.votes/totalVotes)*100);
          const isPicked = votedOptionId === o.id;
          if(hasVoted || !canVote){
            return `
              <div class="poll-result ${isPicked?'is-picked':''}">
                <div class="poll-result-row"><span>${o.label}</span><span>${pct}%</span></div>
                <div class="poll-bar"><div class="poll-bar-fill" style="width:${pct}%"></div></div>
              </div>`;
          }
          return `<button class="poll-option" data-option-id="${o.id}">${o.label}</button>`;
        }).join('')}
        </div>
        <div class="poll-meta">${totalVotes.toLocaleString()} votes ${hasVoted ? '' : (canVote ? ' · Select an option to see live results' : ` · ${gateOrCta('VOTE','', 'Sign in to vote')}`)}</div>
      </div>`;

    if(canVote && !hasVoted){
      container.querySelectorAll('.poll-option').forEach(btn => {
        btn.addEventListener('click', () => {
          const opt = poll.options.find(o => o.id === btn.dataset.optionId);
          if(!opt) return;
          opt.votes += 1;
          votedOptionId = opt.id;
          render();
        });
      });
    }
  }

  render();
  document.addEventListener('fdm:authchange', render);
}

