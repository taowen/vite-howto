import { useViewModel } from "./ViewModel";

function ViewModel() {
  return {
    myValue: '',
    isTyping: false
  }
}
export default useViewModel(ViewModel, (props: { blah?: number }, viewModel) => {
  return <div>
    <input type="text" value={viewModel.myValue} onChange={(e) => {
    viewModel.myValue = e.target.value;
  }} onFocus={() => {
    viewModel.isTyping = true;
  }} onBlur={() => {
    viewModel.isTyping = false;
  }}/>
  characters count: {viewModel.myValue.length}
  </div>;
});
