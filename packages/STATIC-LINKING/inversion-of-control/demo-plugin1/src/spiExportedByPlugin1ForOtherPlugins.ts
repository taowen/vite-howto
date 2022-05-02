import * as plugin1 from '@plugin1';

export const spiExportedByPlugin1ForOtherPlugins: typeof plugin1.spiExportedByPlugin1ForOtherPlugins = () => {
    return 'plugin2 can call plugin1, as long as motherboard declare a spi'
}