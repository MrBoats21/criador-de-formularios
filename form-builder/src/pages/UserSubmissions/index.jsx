import { useState, useEffect } from 'react';
import { useSubmission } from '../../contexts/SubmissionContext';
import { Toast } from '../../components/Toast';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';

export default function UserSubmissions() {
 const [submissions, setSubmissions] = useState([]);
 const [isLoading, setIsLoading] = useState(true);
 const [toast, setToast] = useState(null);
 const [expandedSubmissions, setExpandedSubmissions] = useState({});
 const { getSubmissions } = useSubmission();

 useEffect(() => {
   loadSubmissions();
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 const loadSubmissions = async () => {
   try {
     setIsLoading(true);
     const response = await getSubmissions();
     setSubmissions(response || []);
   // eslint-disable-next-line no-unused-vars
   } catch (error) {
     setToast({ message: 'Erro ao carregar respostas', type: 'error' });
     setSubmissions([]);
   } finally {
     setIsLoading(false);
   }
 };

 const renderAnswerValue = (answer, type) => {
   if (!answer || answer.value === undefined || answer.value === null) return '-';

   // Para múltipla escolha
   if (type === 'multiple' || type === 'multiplechoice') {
     if (Array.isArray(answer.value)) {
       return answer.value.join(', ');
     }
   }

   // Para checkbox
   if (type === 'checkbox') {
     return answer.value ? 'Sim' : 'Não';
   }

   // Para assinatura
   if (type === 'signature') {
     return (
       <img 
         src={answer.value} 
         alt="Assinatura" 
         className="max-w-[200px] max-h-[100px] object-contain"
       />
     );
   }

   // Para arquivo
   if (type === 'file' && answer.value) {
     return (
       <a 
         href={answer.value.data}
         download={answer.value.name}
         onClick={(e) => e.stopPropagation()}
         className="inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm gap-2"
       >
         <Download size={16} />
         Baixar {answer.value.name}
       </a>
     );
   }

   // Para outros tipos
   const text = typeof answer.value === 'object' ? 
     JSON.stringify(answer.value) : 
     answer.value.toString();
   
   return text.length > 100 ? `${text.substring(0, 100)}...` : text;
 };

 const toggleSubmission = (submissionId) => {
   setExpandedSubmissions(prev => ({
     ...prev,
     [submissionId]: !prev[submissionId]
   }));
 };

 if (isLoading) {
   return <div className="p-6">Carregando...</div>;
 }

 return (
   <div className="max-w-6xl mx-auto">
     <h1 className="text-2xl font-bold mb-6">Minhas Respostas</h1>

     {submissions.length === 0 ? (
       <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
         Você ainda não respondeu nenhum formulário.
       </div>
     ) : (
       <div className="space-y-4">
         {submissions.map(submission => (
           <div key={submission.id} className="bg-white rounded-lg shadow">
             <div 
               className="p-6 flex justify-between items-center cursor-pointer"
               onClick={() => toggleSubmission(submission.id)}
             >
               <div>
                 <h2 className="text-xl font-semibold">
                   Formulário: {submission.formTitle}
                 </h2>
                 <p className="text-gray-500 text-sm">
                   Enviado em: {new Date(submission.submittedAt).toLocaleDateString()}
                 </p>
               </div>
               <button 
                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                 aria-label={expandedSubmissions[submission.id] ? "Recolher" : "Expandir"}
               >
                 {expandedSubmissions[submission.id] ? (
                   <ChevronUp className="w-6 h-6 text-gray-600" />
                 ) : (
                   <ChevronDown className="w-6 h-6 text-gray-600" />
                 )}
               </button>
             </div>

             {expandedSubmissions[submission.id] && (
               <div className="px-6 pb-6 border-t pt-4">
                 <div className="space-y-3">
                   {Object.entries(submission.answers).map(([key, answer]) => (
                     <div key={key} className="py-2 border-b border-gray-100 last:border-0 break-words">
                       <span className="font-medium">{answer.label}:</span>{' '}
                       <span className="text-gray-700 inline-block">
                         {renderAnswerValue(answer, answer.type)}
                       </span>
                     </div>
                   ))}
                 </div>
               </div>
             )}
           </div>
         ))}
       </div>
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