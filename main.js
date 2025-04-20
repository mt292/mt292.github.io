
import React from 'https://esm.sh/react'
import ReactDOM from 'https://esm.sh/react-dom'
import { ReactFlow, Background, Controls } from 'https://esm.sh/reactflow'
import 'https://esm.sh/reactflow/dist/style.css'

const nodes = [
  { id: '1', position: { x: 300, y: 600 }, data: { label: 'Highland High School\n2016 – 2020\nExcelled in computer technology programs.' }, className: 'done-node' },
  { id: '2', position: { x: 100, y: 400 }, data: { label: 'Senior Cook & Host\nTomato Bar | 2022 – Present\nManages staff and training.' }, className: 'in-progress' },
  { id: '3', position: { x: 500, y: 400 }, data: { label: 'B.S. Cybersecurity & Criminal Justice\nIndiana Tech | 2024 – Present\nDigital forensics, ethical hacking.' }, className: 'in-progress' },
  { id: '4', position: { x: 300, y: 250 }, data: { label: 'Windows Lead – Cyber Warriors\nIndiana Tech | 2024 – Present\nCCDC, Lockdown, UBUFF.' }, className: 'in-progress' },
  { id: '5', position: { x: 50, y: 250 }, data: { label: 'Offensive Security Specialist\nFreelance / Labs | 2023 – Present\nKali Linux, Metasploit.' }, className: 'in-progress' },
  { id: '6', position: { x: 550, y: 250 }, data: { label: 'Technical Support & Infrastructure\nIndiana Tech IT | 2023 – Present\nAD/LDAP, config & hardening.' }, className: 'in-progress' }
];

const edges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e3-5', source: '3', target: '5' },
  { id: 'e3-6', source: '3', target: '6' }
];

function FlowApp() {
  return (
    <div style={{ height: '1000px', background: '#0f0f0f' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

ReactDOM.render(<FlowApp />, document.getElementById('xyflow-root'));
