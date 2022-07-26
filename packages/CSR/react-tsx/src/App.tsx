import PropertyEditor from './PropertyEditor';
import './App.css';
import { getViewModel } from './ViewModel';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, 1000));
}

function App() {
  const viewModel = getViewModel(PropertyEditor, "np_width");
  viewModel.myValue = 'hello12';
  setTimeout(async () => {
    for (let i = 0; i < 10; i++) {
      viewModel.myValue = 'v: ' + i;
      await sleep(1000);
    }
  }, 1000);
  return <PropertyEditor name="np_width" />;
}

export default App;
