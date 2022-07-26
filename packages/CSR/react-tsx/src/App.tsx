import PropertyEditor from './PropertyEditor';
import './App.css';
import { getViewModel } from './ViewModel';
import LayersPanel from './LayersPanel';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, 1000));
}

function syncViewModels() {
  syncLayer1();
  getViewModel(PropertyEditor, "layer2").myValue = "world~~";
  getViewModel(LayersPanel).layers = ['layer1', 'layer2'];
}

function syncLayer1() {
  const viewModel = getViewModel(PropertyEditor, "layer1");
  viewModel.myValue = 'hello12';
  setTimeout(async () => {
    for (let i = 0; i < 100; i++) {
      if (!viewModel.isTyping) {
        viewModel.myValue = 'v: ' + i;
      }
      await sleep(1000);
    }
  }, 1000);
}

function App() {
  syncViewModels();
  return <LayersPanel />;
}

export default App;
