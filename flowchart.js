
const { ReactFlowProvider, ReactFlow, Handle } = window.ReactFlow;

const CustomNode = ({ data }) => {
  return React.createElement('div', { style: {
    backgroundColor: '#1e1e1e',
    padding: '10px',
    border: '1px solid #444',
    borderRadius: '8px',
    color: 'white',
    width: '200px'
  } }, [
    React.createElement('div', { style: { fontWeight: 'bold' } }, data.label),
    React.createElement('div', {}, data.description),
    React.createElement(Handle, { type: 'target', position: 'top' }),
    React.createElement(Handle, { type: 'source', position: 'bottom' })
  ]);
};

const nodeTypes = { custom: CustomNode };

const nodes = [
  { id: '1', type: 'custom', position: { x: 250, y: 25 }, data: { label: 'Highland High School', description: '2016 – 2020 ✅' } },
  { id: '2', type: 'custom', position: { x: 100, y: 150 }, data: { label: 'Senior Cook & Host', description: 'Tomato Bar | 2022 – Present ⏳' } },
  { id: '3', type: 'custom', position: { x: 400, y: 150 }, data: { label: 'B.S. Cybersecurity & CJ', description: 'Indiana Tech | 2024 – Present ⏳' } },
  { id: '4', type: 'custom', position: { x: 250, y: 300 }, data: { label: 'Windows Lead — Cyber Warriors', description: '2024 – Present ⏳' } },
  { id: '5', type: 'custom', position: { x: 500, y: 300 }, data: { label: 'Offensive Security Specialist', description: '2023 – Present ⏳' } }
];

const edges = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
  { id: 'e1-3', source: '1', target: '3', type: 'smoothstep' },
  { id: 'e3-4', source: '3', target: '4', type: 'smoothstep' },
  { id: 'e3-5', source: '3', target: '5', type: 'smoothstep' }
];

function FlowChart() {
  return React.createElement(ReactFlowProvider, null,
    React.createElement(ReactFlow, {
      nodes,
      edges,
      nodeTypes,
      fitView: true
    })
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(FlowChart));
