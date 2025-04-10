
import React from 'react';
import WordManagement from '../../components/management/WordManagement';

const ManagementPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">การจัดการแอปสร้างกำลังใจ</h1>
      <div className="grid gap-8">
        <WordManagement />
        {/* Additional management components can be added here */}
      </div>
    </div>
  );
};

export default ManagementPage;
