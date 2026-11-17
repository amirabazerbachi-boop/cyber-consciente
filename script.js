// Cyber Consciente — interações sem bibliotecas externas
const menuToggle=document.getElementById('menuToggle');
const mainNav=document.getElementById('mainNav');
menuToggle.addEventListener('click',()=>{const open=mainNav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));menuToggle.textContent=open?'×':'☰';});
mainNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mainNav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.textContent='☰';}));

// Entrada suave dos elementos
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// Navegação de abas
document.querySelectorAll('.tab-button').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.tab-button').forEach(b=>b.classList.toggle('active',b===btn));
  document.querySelectorAll('.tab-panel').forEach(panel=>panel.classList.toggle('active',panel.id==='tab-'+btn.dataset.tab));
}));

// Checklist com progresso
const checkboxes=[...document.querySelectorAll('.check-item input')];
const percent=document.getElementById('checkPercent');
const ring=document.getElementById('checkRing');
const message=document.getElementById('checkMessage');
function updateChecklist(){
  const done=checkboxes.filter(c=>c.checked).length;
  const value=Math.round(done/checkboxes.length*100);
  percent.textContent=value+'%';
  ring.style.background=`conic-gradient(from -90deg, rgba(216,182,106,.18) ${value}%, transparent ${value}%)`;
  message.textContent=value===100?'Excelente! Você concluiu todos os cuidados.':`${done} de ${checkboxes.length} cuidados concluídos.`;
}
checkboxes.forEach(c=>c.addEventListener('change',updateChecklist));
document.getElementById('resetChecklist').addEventListener('click',()=>{checkboxes.forEach(c=>c.checked=false);updateChecklist();});

// Quiz — cinco questões com explicação após cada resposta
const questions=[
 {q:'Uma pessoa envia mensagem de um número novo, usando a foto de um familiar, e pede uma transferência urgente. O que fazer primeiro?',a:['Transferir um valor pequeno para testar.','Ligar para o número antigo ou confirmar por outro canal conhecido.','Perguntar o nome completo e confiar na resposta.','Enviar o código recebido por SMS.'],correct:1,why:'A identidade deve ser confirmada por um canal que você já conhece. Foto e nome podem ser copiados.'},
 {q:'Você terminou de usar seu e-mail em um computador do laboratório. Qual atitude é correta?',a:['Fechar apenas a aba do navegador.','Deixar a conta aberta para facilitar o próximo acesso.','Fazer logout, fechar os documentos e encerrar a sessão.','Salvar a senha no navegador.'],correct:2,why:'O logout encerra o acesso à conta. Fechar apenas a aba pode não encerrar a sessão.'},
 {q:'Qual situação é um sinal de alerta típico do golpe do “mudei de número”?',a:['Uma mensagem sem pedido algum.','Um pedido urgente de dinheiro vindo de um número desconhecido que afirma ser familiar.','Uma ligação feita para o contato antigo.','Uma conversa presencial.'],correct:1,why:'O golpista usa a falsa troca de número e a urgência para pressionar a vítima.'},
 {q:'Ao encontrar um pendrive desconhecido no laboratório, o que você deve fazer?',a:['Conectar para descobrir de quem é.','Levar para casa e testar.','Não conectar e comunicar o responsável ou a TI.','Desativar o antivírus antes de abrir.'],correct:2,why:'Dispositivos desconhecidos podem conter arquivos maliciosos. Não conecte e avise o responsável.'},
 {q:'Qual conjunto de atitudes ajuda a manter um posto compartilhado seguro?',a:['Deixar líquidos ao lado do teclado e cabos no caminho.','Desativar proteções para o computador ficar mais rápido.','Ajustar a postura, manter cabos organizados e fazer pausas.','Instalar programas sem autorização.'],correct:2,why:'Ergonomia, organização e respeito às regras de TI protegem as pessoas e os equipamentos.'}
];
let current=0,score=0,answered=false;
const qText=document.getElementById('questionText'),answers=document.getElementById('answers'),feedback=document.getElementById('quizFeedback'),next=document.getElementById('quizNext'),counter=document.getElementById('quizCounter'),progress=document.getElementById('quizProgress');
function renderQuestion(){
  answered=false;const q=questions[current];counter.textContent=`PERGUNTA ${String(current+1).padStart(2,'0')} / 05`;progress.style.width=((current+1)/5*100)+'%';qText.textContent=q.q;answers.innerHTML='';feedback.textContent='';next.disabled=true;next.innerHTML=current===4?'Ver resultado <span>→</span>':'Próxima pergunta <span>→</span>';
  q.a.forEach((answer,i)=>{const button=document.createElement('button');button.className='answer';button.innerHTML=`<span class="letter">${String.fromCharCode(65+i)}</span><span></span>`;button.querySelector('span:last-child').textContent=answer;button.addEventListener('click',()=>chooseAnswer(i));answers.appendChild(button);});
}
function chooseAnswer(index){
 if(answered)return;answered=true;const q=questions[current],buttons=[...answers.children];buttons.forEach((b,i)=>{b.disabled=true;if(i===q.correct)b.classList.add('correct');if(i===index&&i!==q.correct)b.classList.add('wrong');});
 if(index===q.correct){score++;feedback.textContent='Correto! '+q.why;}else{feedback.textContent='Não é essa a atitude mais segura. '+q.why;}
 next.disabled=false;
}
next.addEventListener('click',()=>{if(!answered)return;if(current<4){current++;renderQuestion();}else showResult();});
function showResult(){document.getElementById('quizContent').hidden=true;document.getElementById('quizResult').hidden=false;document.getElementById('resultScore').textContent=`${score} / 5`;document.getElementById('resultTitle').textContent=score===5?'Excelente! Você está preparado.':score>=3?'Muito bem! Continue atento.':'Vamos reforçar sua proteção.';document.getElementById('resultText').textContent=score===5?'Você reconheceu todas as situações e escolheu as atitudes mais seguras.':`Você acertou ${score} de 5 questões. Revise as orientações e tente novamente para fortalecer seus hábitos de segurança.`;}
document.getElementById('restartQuiz').addEventListener('click',()=>{current=0;score=0;document.getElementById('quizContent').hidden=false;document.getElementById('quizResult').hidden=true;renderQuestion();});
renderQuestion();

// Botão voltar ao topo
const toTop=document.getElementById('toTop');
window.addEventListener('scroll',()=>toTop.classList.toggle('visible',window.scrollY>550),{passive:true});
toTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
