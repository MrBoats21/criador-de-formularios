import { useState } from 'react';
import { useForm } from '../../contexts/FormContext';
import { useCompany } from '../../contexts/CompanyContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { forms } = useForm();
  const { companies } = useCompany();
  const [dateFilter, setDateFilter] = useState('all');

  const filterByDate = (data) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    switch(dateFilter) {
      case 'today':
        return data.filter(item => new Date(item.createdAt) >= today);
      case 'week':
        return data.filter(item => new Date(item.createdAt) >= weekAgo);
      case 'month':
        return data.filter(item => new Date(item.createdAt) >= monthAgo);
      default:
        return data;
    }
  };

  const filteredForms = filterByDate(forms);
  const totalForms = filteredForms.length;
  
  const formsByCompany = companies.map(company => ({
    name: company.name,
    count: filteredForms.filter(form => form.companyId === company.id).length
  }));

  const submissionStatuses = {
    completed: filteredForms.filter(form => form.submissions?.some(s => s.status === 'completed')).length,
    pending: filteredForms.filter(form => form.submissions?.some(s => s.status === 'pending')).length
  };

  const submissionData = [
    { name: 'Completas', value: submissionStatuses.completed },
    { name: 'Pendentes', value: submissionStatuses.pending }
  ];

  const COLORS = ['#10B981', '#FBBF24'];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="all">Todos os períodos</option>
          <option value="today">Hoje</option>
          <option value="week">Última semana</option>
          <option value="month">Último mês</option>
        </select>
      </div>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm mb-1">Total de Formulários</h3>
          <p className="text-3xl font-bold">{totalForms}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm mb-1">Submissões Completas</h3>
          <p className="text-3xl font-bold text-green-500">{submissionStatuses.completed}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm mb-1">Submissões Pendentes</h3>
          <p className="text-3xl font-bold text-yellow-500">{submissionStatuses.pending}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Formulários por Empresa</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formsByCompany}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3B82F6" name="Formulários" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Status das Submissões</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={submissionData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {submissionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}