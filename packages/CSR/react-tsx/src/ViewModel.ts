import { useEffect, useRef, useState } from "react";

const viewModels = new Map<any, Map<string, any>>();

export function getViewModel<M>(component: { __ViewModelFactory: () => M}, name: string): M {
  let perComponentType = viewModels.get(component);
  if (!perComponentType) {
    viewModels.set(component, perComponentType = new Map<string, object>());
  }
  let viewModel = perComponentType.get(name);
  if (!viewModel) {
    perComponentType.set(name, viewModel = component.__ViewModelFactory());
  }
  return viewModel;
}

export function listViewModels<M>(component: { __ViewModelFactory: () => M}): Map<string, M> {
    let perComponentType = viewModels.get(component);
    if (!perComponentType) {
        viewModels.set(component, perComponentType = new Map<string, object>());
    }
    return perComponentType;
}

export function removeViewModel<M>(component: { __ViewModelFactory: () => M}, name: string) {
    let perComponentType = viewModels.get(component);
    if (!perComponentType) {
        return;
    }
    perComponentType.delete(name);
    if (perComponentType.size === 0) {
        viewModels.delete(component);
    }
}

export function useViewModel<C, R extends { options: any }>(viewModelFactory: () => R, component: (options: R['options'], viewModel: R) => C) {
  const wrapper = (options: Partial<R['options']> & { name: string }): C => {
    const viewModel: any = getViewModel(wrapper, options.name);
    useEffect(() => {
        removeViewModel(wrapper, options.name);
    }, []);
    const viewModelPropNames = useRef<string[] | undefined>(undefined);
    if (viewModelPropNames.current) {
        for (const _ of viewModelPropNames.current) {
            useState();
        }
    } else {
        viewModelPropNames.current = Object.getOwnPropertyNames(viewModel);
        viewModelPropNames.current.splice(viewModelPropNames.current.indexOf('options'), 1);
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
    return component(options, viewModel);
  };
  wrapper.__ViewModelFactory = viewModelFactory;
  return wrapper;
}