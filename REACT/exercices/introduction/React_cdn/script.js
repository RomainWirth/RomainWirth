const App = () => {
  return (
    <div>
      <h2>Functional Component</h2>
      <p>This is a functional component in React.</p>
    </div>
  );
}

const container = document.getElementById('app');
const root = ReactDOM.createRoot(container);
root.render(<App />);