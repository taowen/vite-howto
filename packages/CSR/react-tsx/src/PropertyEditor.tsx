import { useViewModel } from "./ViewModel";

function ViewModel() {
  return {
    options: {
      blah: 123
    },
    myValue: ''
  }
}
export default useViewModel(ViewModel, (options, viewModel) => {
  return <input type="text" value={viewModel.myValue} onChange={(e) => {
    viewModel.myValue = e.target.value;
  }}/>;
});
