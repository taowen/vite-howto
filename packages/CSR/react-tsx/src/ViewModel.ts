import { useRef, useState } from "react";

// 每个 React 组件类型的 ViewModel 相当于一张表
// 每个 React 组件实例，通过自己的 name 在这张表上有自己的一行
// 这里的 viewModels 通过双层 Map 包含了所有的 React 组件实例的 ViewModel
const viewModels = new Map<Function, Map<string | undefined, object>>();

export function getViewModel<M extends object>(component: Function & { __ViewModelFactory: () => M}, name?: string): M {
  let perComponentType = viewModels.get(component);
  if (!perComponentType) {
    viewModels.set(component, perComponentType = new Map<string, object>());
  }
  let viewModel = perComponentType.get(name);
  if (!viewModel) {
    perComponentType.set(name, viewModel = component.__ViewModelFactory());
  }
  return viewModel as M;
}

export function listViewModels<M extends object>(component: Function & { __ViewModelFactory: () => M}): Map<string, M> {
    let perComponentType = viewModels.get(component);
    if (!perComponentType) {
        viewModels.set(component, perComponentType = new Map<string, object>());
    }
    return perComponentType as Map<string, M>;
}

export function removeViewModel<M>(component: Function & { __ViewModelFactory: () => M}, name?: string) {
    let perComponentType = viewModels.get(component);
    if (!perComponentType) {
        return;
    }
    perComponentType.delete(name);
    if (perComponentType.size === 0) {
        viewModels.delete(component);
    }
}

export function useViewModel<P, C, R extends object>(viewModelFactory: () => R, component: (props: P, viewModel: R) => C) {
  const wrapper = (props: P & { name?: string }): C => {
    const viewModel: any = getViewModel(wrapper, props.name);
    const viewModelPropNames = useRef<string[] | undefined>(undefined);
    if (viewModelPropNames.current) {
        for (const _ of viewModelPropNames.current) {
            useState();
        }
    } else {
        // 第一次渲染的时候，把本地状态和ViewModel做一个绑定
        viewModelPropNames.current = Object.getOwnPropertyNames(viewModel);
        for (const propName of viewModelPropNames.current) {
            let val = viewModel[propName];
            const [_, setProp] = useState(val);
            Object.defineProperty(viewModel, propName, {
                get() {
                    return val;
                },
                set(newVal) { 
                    val = newVal;
                    setProp(newVal); 
                },
                enumerable: true,
            });
        }
    }
    return component(props, viewModel);
  };
  wrapper.__ViewModelFactory = viewModelFactory;
  return wrapper;
}