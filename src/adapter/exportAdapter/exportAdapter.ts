import { ExportAdapter } from '../../interfaces/adapters';
import exportJsonAdapter from './exportAdapterCollection/exportJsonAdapter';

const exportAdapter: ExportAdapter = {
  async exportData(): Promise<void> {
    exportJsonAdapter.exportData();
  },
};

export default exportAdapter;