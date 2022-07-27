import PropertyEditor from "./PropertyEditor";
import { useViewModel } from "./ViewModel";

function ViewModel() {
  return {
    layers: [] as string[]
  }
}
export default useViewModel(ViewModel, (props: { blah?: number }, viewModel) => {
  return <div>
    {
      viewModel.layers.map(layer => <div><PropertyEditor name={layer} /></div>)
    }
  </div>;
});
