import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState, useEffect } from 'react';
import { FormPreview } from '../../components/FormBuilder/Preview';
import { FieldTypeModal } from '../../components/FormBuilder/FieldTypeModal';
import { Toast } from '../../components/Toast';
import { fieldTypes } from '../../utils/fieldTypes';
import { useForm } from '../../contexts/FormContext';
import { useCompany } from '../../contexts/CompanyContext';

export default function FormBuilder() {
  const [formTitle, setFormTitle] = useState('');
  const [fields, setFields] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const { saveForm, currentForm, forms } = useForm();
  const { companies, getCompany } = useCompany();

  const selectedCompany = selectedCompanyId ? getCompany(Number(selectedCompanyId)) : null;

  useEffect(() => {
    if (currentForm) {
      const form = forms.find(f => f.id === currentForm);
      if (form) {
        setFormTitle(form.title);
        setFields(form.fields);
        setSelectedCompanyId(form.companyId);
      }
    }
  }, [currentForm, forms]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFields(items);
  };

  const handleAddField = (fieldConfig) => {
    const newField = {
      id: Date.now().toString(),
      ...fieldConfig,
      label: ''
    };
    setFields([...fields, newField]);
    setShowModal(false);
  };

  const handleSave = async () => {
    if (!selectedCompanyId) {
      setToast({ message: 'Selecione uma empresa', type: 'error' });
      return;
    }

    try {
      await saveForm({
        title: formTitle,
        fields,
        companyId: Number(selectedCompanyId),
        updatedAt: new Date().toISOString()
      });
      setToast({ message: 'Formulário salvo com sucesso', type: 'success' });
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setToast({ message: 'Erro ao salvar formulário', type: 'error' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Título do Formulário"
            className="text-2xl font-bold p-2 w-full focus:outline-none"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors ml-4"
          >
            Salvar
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Empresa</label>
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Selecione uma empresa</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Campos do Formulário</h3>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Adicionar Campo
              </button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="fields">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {fields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`p-4 border rounded-lg bg-white ${
                              snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
                            } transition-shadow`}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-move text-gray-400 hover:text-gray-600"
                              >
                                ⋮⋮
                              </div>
                              <input
                                type="text"
                                placeholder="Nome do Campo"
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={field.label}
                                onChange={(e) => {
                                  const updatedFields = fields.map(f =>
                                    f.id === field.id ? { ...f, label: e.target.value } : f
                                  );
                                  setFields(updatedFields);
                                }}
                              />
                              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                                {fieldTypes[field.type]?.label}
                              </span>
                              <button 
                                onClick={() => setFields(fields.filter(f => f.id !== field.id))}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>

        <div className="sticky top-6">
          <div className="bg-white rounded-xl shadow-sm">
            <FormPreview 
              fields={fields} 
              title={formTitle} 
              theme={selectedCompany ? {
                backgroundColor: selectedCompany.backgroundColor,
                primaryColor: selectedCompany.primaryColor,
                secondaryColor: selectedCompany.secondaryColor,
                fontFamily: 'Arial',
                fontSize: 'base',
                logoUrl: selectedCompany.logoUrl
              } : {
                backgroundColor: '#ffffff',
                primaryColor: '#3b82f6',
                secondaryColor: '#1d4ed8',
                fontFamily: 'Arial',
                fontSize: 'base'
              }}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <FieldTypeModal
          onAdd={handleAddField}
          onClose={() => setShowModal(false)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}