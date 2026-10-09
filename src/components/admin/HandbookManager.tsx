import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Upload,
  FileText,
  Search,
  Download,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  User,
  Users,
  Shield,
  Sparkles,
  RefreshCw,
  ExternalLink,
  X,
  FileUp,
  MessageSquare,
  Plus,
  Globe,
  EyeOff,
  Lock,
  Layers,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface HandbookItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  targetAudience: string;
  pages: number;
  topics: string[];
  summary: string;
  pdfFilePath?: string | null;
  pdfFileName?: string | null;
  pdfSizeBytes?: number | null;
  status: 'published' | 'draft' | 'archived';
  displayOrder: number;
  downloadCount: number;
  leadCount?: number;
  hasCustomPdf?: boolean;
  fileExists?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface HandbookLead {
  id: number;
  handbookId: string;
  handbookTitle: string;
  fullName?: string;
  email: string;
  mobileNumber: string;
  ipAddress?: string;
  userAgent?: string;
  status: string;
  notes?: string;
  createdAt: string;
}

export const HandbookManager: React.FC = () => {
  const { isLight } = useTheme();

  // Active view inside handbook manager: 'handbooks' or 'leads'
  const [activeSubTab, setActiveSubTab] = useState<'handbooks' | 'leads'>('handbooks');

  // Handbooks state
  const [handbooks, setHandbooks] = useState<HandbookItem[]>([]);
  const [loadingHandbooks, setLoadingHandbooks] = useState(true);

  // Leads state
  const [leads, setLeads] = useState<HandbookLead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [searchLeadQuery, setSearchLeadQuery] = useState('');
  const [selectedHandbookFilter, setSelectedHandbookFilter] = useState('');

  // Notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Upload PDF for existing handbook state
  const [uploadingHandbookId, setUploadingHandbookId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetHandbookForUpload, setTargetHandbookForUpload] = useState<HandbookItem | null>(null);

  // Preview Modal
  const [previewHandbook, setPreviewHandbook] = useState<HandbookItem | null>(null);

  // Edit Metadata Modal
  const [editingHandbook, setEditingHandbook] = useState<HandbookItem | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    subtitle: '',
    targetAudience: '',
    pages: 40,
    summary: '',
    topicsInput: '',
    status: 'published' as 'published' | 'draft' | 'archived',
    displayOrder: 1,
  });

  // Create New Handbook Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createPdfFile, setCreatePdfFile] = useState<File | null>(null);
  const createFileInputRef = useRef<HTMLInputElement>(null);
  const [createFormData, setCreateFormData] = useState({
    title: '',
    subtitle: '',
    targetAudience: '',
    pages: 40,
    summary: '',
    topicsInput: '',
    status: 'published' as 'published' | 'draft',
    displayOrder: 1,
  });

  const showNotify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  // Fetch Handbooks
  const fetchHandbooks = async () => {
    try {
      setLoadingHandbooks(true);
      const res = await fetch('/api/admin/handbooks');
      if (!res.ok) throw new Error('Failed to load handbooks');
      const data = await res.json();
      setHandbooks(data.handbooks || []);
    } catch (err: any) {
      console.error('Error fetching handbooks:', err);
      showNotify('error', err.message || 'Failed to fetch handbooks');
    } finally {
      setLoadingHandbooks(false);
    }
  };

  // Fetch Leads
  const fetchLeads = async () => {
    try {
      setLoadingLeads(true);
      const params = new URLSearchParams();
      if (searchLeadQuery) params.set('q', searchLeadQuery);
      if (selectedHandbookFilter) params.set('handbookId', selectedHandbookFilter);

      const res = await fetch(`/api/admin/handbooks/leads?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load handbook leads');
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      showNotify('error', err.message || 'Failed to load client leads');
    } finally {
      setLoadingLeads(false);
    }
  };

  useEffect(() => {
    fetchHandbooks();
  }, []);

  useEffect(() => {
    if (activeSubTab === 'leads') {
      fetchLeads();
    }
  }, [activeSubTab, searchLeadQuery, selectedHandbookFilter]);

  // Handle PDF file selection & upload for existing handbook
  const handleTriggerUpload = (hb: HandbookItem) => {
    setTargetHandbookForUpload(hb);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetHandbookForUpload) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      showNotify('error', 'Only genuine PDF documents (.pdf) can be uploaded.');
      return;
    }

    const maxSizeBytes = 35 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      showNotify('error', `Selected PDF is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum allowed is 35MB.`);
      return;
    }

    const hbId = targetHandbookForUpload.id;
    setUploadingHandbookId(hbId);
    setUploadProgress(`Reading ${(file.size / 1024 / 1024).toFixed(2)} MB PDF file...`);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setUploadProgress('Encrypting and securing PDF in protected storage...');
        const base64Data = reader.result as string;

        const res = await fetch('/api/admin/handbooks/upload-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            handbookId: hbId,
            fileName: file.name,
            mimeType: 'application/pdf',
            base64Data,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to upload handbook PDF.');

        showNotify('success', `PDF replaced successfully for "${targetHandbookForUpload.title}"! File is secured in protected storage.`);
        fetchHandbooks();
      } catch (uploadErr: any) {
        console.error('Upload error:', uploadErr);
        showNotify('error', uploadErr.message || 'PDF upload failed.');
      } finally {
        setUploadingHandbookId(null);
        setUploadProgress(null);
        setTargetHandbookForUpload(null);
      }
    };

    reader.onerror = () => {
      setUploadingHandbookId(null);
      setUploadProgress(null);
      showNotify('error', 'Failed to read file from disk.');
    };

    reader.readAsDataURL(file);
  };

  // Quick Toggle Mode (Draft vs Published)
  const handleToggleStatus = async (hb: HandbookItem) => {
    const nextStatus = hb.status === 'published' ? 'draft' : 'published';
    const statusLabel = nextStatus === 'published' ? 'Published (Now visible publicly)' : 'Draft (Hidden from public website)';

    try {
      const res = await fetch(`/api/admin/handbooks/${hb.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update mode');

      setHandbooks((prev) =>
        prev.map((item) => (item.id === hb.id ? { ...item, status: nextStatus } : item))
      );
      showNotify('success', `"${hb.title}" mode updated to: ${statusLabel}`);
    } catch (err: any) {
      showNotify('error', err.message || 'Failed to update mode');
    }
  };

  // Open Edit Metadata
  const handleOpenEdit = (hb: HandbookItem) => {
    setEditingHandbook(hb);
    setEditFormData({
      title: hb.title,
      subtitle: hb.subtitle || '',
      targetAudience: hb.targetAudience,
      pages: hb.pages,
      summary: hb.summary,
      topicsInput: Array.isArray(hb.topics) ? hb.topics.join(', ') : '',
      status: hb.status,
      displayOrder: hb.displayOrder,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHandbook) return;

    try {
      const topicsArr = editFormData.topicsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch(`/api/admin/handbooks/${editingHandbook.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editFormData.title,
          subtitle: editFormData.subtitle,
          targetAudience: editFormData.targetAudience,
          pages: editFormData.pages,
          summary: editFormData.summary,
          topics: topicsArr,
          status: editFormData.status,
          displayOrder: editFormData.displayOrder,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update handbook');

      showNotify(
        'success',
        `Updated "${editFormData.title}" (Mode: ${editFormData.status === 'published' ? 'Published' : 'Draft'}).`
      );
      setEditingHandbook(null);
      fetchHandbooks();
    } catch (err: any) {
      showNotify('error', err.message || 'Failed to update handbook');
    }
  };

  // Handle Create New Handbook Submit
  const handleCreateHandbookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createFormData.title.trim() || !createFormData.targetAudience.trim() || !createFormData.summary.trim()) {
      showNotify('error', 'Please fill in Title, Target Audience, and Summary.');
      return;
    }

    setIsCreating(true);

    try {
      let pdfBase64: string | undefined = undefined;
      let pdfFileName: string | undefined = undefined;

      if (createPdfFile) {
        pdfFileName = createPdfFile.name;
        pdfBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read PDF file'));
          reader.readAsDataURL(createPdfFile);
        });
      }

      const topicsArr = createFormData.topicsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch('/api/admin/handbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: createFormData.title.trim(),
          subtitle: createFormData.subtitle.trim(),
          targetAudience: createFormData.targetAudience.trim(),
          pages: createFormData.pages,
          summary: createFormData.summary.trim(),
          topics: topicsArr,
          status: createFormData.status,
          displayOrder: createFormData.displayOrder,
          pdfFileName,
          pdfBase64,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create handbook');

      showNotify(
        'success',
        createFormData.status === 'published'
          ? `Handbook "${createFormData.title}" created and published publicly on website!`
          : `Handbook "${createFormData.title}" created in Draft mode (hidden from public website).`
      );

      // Reset form and close modal
      setIsCreateModalOpen(false);
      setCreatePdfFile(null);
      setCreateFormData({
        title: '',
        subtitle: '',
        targetAudience: '',
        pages: 40,
        summary: '',
        topicsInput: '',
        status: 'published',
        displayOrder: handbooks.length + 1,
      });

      fetchHandbooks();
    } catch (err: any) {
      console.error('Error creating handbook:', err);
      showNotify('error', err.message || 'Failed to create handbook');
    } finally {
      setIsCreating(false);
    }
  };

  // Delete Handbook
  const handleDeleteHandbook = async (hb: HandbookItem) => {
    if (!confirm(`Are you sure you want to permanently delete "${hb.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/handbooks/${hb.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete handbook');
      showNotify('success', `Handbook "${hb.title}" deleted.`);
      fetchHandbooks();
    } catch (err: any) {
      showNotify('error', err.message || 'Failed to delete handbook');
    }
  };

  // Delete Lead
  const handleDeleteLead = async (id: number) => {
    if (!confirm('Are you sure you want to remove this client contact record?')) return;

    try {
      const res = await fetch(`/api/admin/handbooks/leads/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete lead record');
      showNotify('success', 'Lead record removed.');
      fetchLeads();
      fetchHandbooks();
    } catch (err: any) {
      showNotify('error', err.message || 'Failed to delete lead');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    window.location.href = '/api/admin/handbooks/leads/export';
  };

  // Stats
  const totalLeadsCount = handbooks.reduce((acc, h) => acc + (h.leadCount || 0), 0);
  const totalPublishedCount = handbooks.filter((h) => h.status === 'published').length;
  const totalDraftCount = handbooks.filter((h) => h.status === 'draft').length;

  return (
    <div className="space-y-6">
      {/* Hidden File Input for PDF upload on existing handbook */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top Banner & Header */}
      <div
        className={`p-6 rounded-2xl border-2 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isLight
            ? 'bg-gradient-to-r from-amber-50/70 via-stone-50 to-orange-50/50 border-[#D4A72C]/40 text-stone-900'
            : 'bg-gradient-to-r from-[#22140E] via-[#1A100B] to-[#28150D] border-[#D4A72C]/40 text-[#FFF7ED]'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-serif uppercase tracking-wider font-bold bg-[#6B1F1F] text-[#FFF7ED]">
              Classical Treatises & Field Manuals
            </span>
            <span className="text-xs font-serif text-[#E88A16] font-bold">
              Protected PDF Vault
            </span>
          </div>
          <h2 className="font-['Cinzel_Decorative'] text-2xl font-black">
            Handbook Management
          </h2>
          <p className="font-['Marcellus'] text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-2xl">
            Create, publish, and manage canonical Vastu Field Handbooks. Set mode to <strong>Published</strong> to display publicly on the website, or <strong>Draft</strong> to keep private.
          </p>
        </div>

        {/* View Switcher & Add Button */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setCreateFormData({
                title: '',
                subtitle: '',
                targetAudience: '',
                pages: 40,
                summary: '',
                topicsInput: '',
                status: 'published',
                displayOrder: handbooks.length + 1,
              });
              setCreatePdfFile(null);
              setIsCreateModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4A72C] to-[#E88A16] hover:brightness-110 text-[#2D1B14] font-serif font-bold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Handbook</span>
          </button>

          <button
            onClick={() => setActiveSubTab('handbooks')}
            className={`px-4 py-2 rounded-xl font-serif text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'handbooks'
                ? 'bg-[#6B1F1F] text-[#FFF7ED] shadow-md'
                : isLight
                ? 'bg-stone-200/70 hover:bg-stone-300/80 text-stone-700'
                : 'bg-white/10 hover:bg-white/20 text-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#D4A72C]" />
            <span>Handbooks ({handbooks.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('leads')}
            className={`px-4 py-2 rounded-xl font-serif text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'leads'
                ? 'bg-[#6B1F1F] text-[#FFF7ED] shadow-md'
                : isLight
                ? 'bg-stone-200/70 hover:bg-stone-300/80 text-stone-700'
                : 'bg-white/10 hover:bg-white/20 text-stone-200'
            }`}
          >
            <Users className="w-4 h-4 text-[#D4A72C]" />
            <span>Client Leads ({totalLeadsCount})</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-serif font-bold flex items-center gap-3 animate-fadeIn ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
              : 'bg-red-500/10 border border-red-500/40 text-red-700 dark:text-red-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isLight ? 'bg-white border-stone-200' : 'bg-[#1E110D] border-stone-800'
          }`}
        >
          <span className="text-[11px] font-serif uppercase tracking-wider text-stone-500 block">Total Handbooks</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-['Cinzel',serif] text-2xl font-black">{handbooks.length}</span>
            <span className="text-xs text-stone-500 font-serif">In Catalog</span>
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isLight ? 'bg-white border-stone-200' : 'bg-[#1E110D] border-stone-800'
          }`}
        >
          <span className="text-[11px] font-serif uppercase tracking-wider text-stone-500 block">Live & Publicly Visible</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-['Cinzel',serif] text-2xl font-black text-emerald-600">{totalPublishedCount}</span>
            <span className="text-xs text-emerald-600 font-serif">Published Mode</span>
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isLight ? 'bg-white border-stone-200' : 'bg-[#1E110D] border-stone-800'
          }`}
        >
          <span className="text-[11px] font-serif uppercase tracking-wider text-stone-500 block">Draft / Private</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-['Cinzel',serif] text-2xl font-black text-amber-600">{totalDraftCount}</span>
            <span className="text-xs text-amber-600 font-serif">Hidden from Public</span>
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isLight ? 'bg-white border-stone-200' : 'bg-[#1E110D] border-stone-800'
          }`}
        >
          <span className="text-[11px] font-serif uppercase tracking-wider text-stone-500 block">Client Leads Captured</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-['Cinzel',serif] text-2xl font-black text-[#D4A72C]">{totalLeadsCount}</span>
            <span className="text-xs text-stone-400 font-serif">Verified Inquiries</span>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: HANDBOOKS CATALOG & UPLOAD MANAGEMENT */}
      {activeSubTab === 'handbooks' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-['Cinzel',serif] text-lg font-bold">
                Handbooks & Protected PDFs Catalog
              </h3>
              <p className="text-xs font-serif text-stone-500">
                Click on the <strong>Published / Draft</strong> badge on any card to toggle public visibility.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCreateFormData({
                    title: '',
                    subtitle: '',
                    targetAudience: '',
                    pages: 40,
                    summary: '',
                    topicsInput: '',
                    status: 'published',
                    displayOrder: handbooks.length + 1,
                  });
                  setCreatePdfFile(null);
                  setIsCreateModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#6B1F1F] hover:bg-[#8B2B2B] text-[#FFF7ED] font-serif font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#D4A72C]" />
                <span>Add Handbook</span>
              </button>

              <button
                onClick={fetchHandbooks}
                className={`p-2 rounded-xl text-xs font-serif transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isLight ? 'hover:bg-stone-200 text-stone-600' : 'hover:bg-white/10 text-stone-300'
                }`}
                title="Refresh list"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {loadingHandbooks ? (
            <div className="p-12 text-center font-serif text-sm text-stone-500">
              Loading handbook catalog and storage status...
            </div>
          ) : handbooks.length === 0 ? (
            <div className="p-12 text-center font-serif text-sm rounded-2xl border border-dashed text-stone-500 space-y-3">
              <BookOpen className="w-10 h-10 mx-auto text-amber-600 opacity-60" />
              <p className="font-bold">No handbooks found.</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#6B1F1F] text-[#FFF7ED] font-bold text-xs cursor-pointer"
              >
                Create Your First Handbook
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {handbooks.map((hb) => {
                const isUploadingThis = uploadingHandbookId === hb.id;
                const isPublished = hb.status === 'published';
                const fileSizeFormatted = hb.pdfSizeBytes
                  ? `${(hb.pdfSizeBytes / 1024).toFixed(0)} KB`
                  : 'Compiled Standard';

                return (
                  <div
                    key={hb.id}
                    className={`rounded-2xl border-2 shadow-md p-6 flex flex-col justify-between space-y-5 transition-all relative ${
                      isLight
                        ? isPublished
                          ? 'bg-white border-stone-200 hover:border-[#D4A72C]/60 text-stone-900'
                          : 'bg-stone-50/80 border-dashed border-stone-300 text-stone-800'
                        : isPublished
                        ? 'bg-[#1E110D] border-stone-800 hover:border-[#D4A72C]/60 text-[#FFF7ED]'
                        : 'bg-[#160D09]/90 border-dashed border-stone-800 text-stone-300'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Badges & Public Mode Toggle */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-serif font-bold uppercase tracking-wider bg-[#6B1F1F] text-[#FFF7ED]">
                          {hb.targetAudience}
                        </span>

                        {/* Interactive Mode Toggle Badge */}
                        <button
                          onClick={() => handleToggleStatus(hb)}
                          className={`text-[10px] font-serif font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95 ${
                            isPublished
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25'
                              : 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25'
                          }`}
                          title={`Click to switch to ${isPublished ? 'Draft (Hide from public website)' : 'Published (Show publicly on website)'}`}
                        >
                          {isPublished ? (
                            <>
                              <Globe className="w-3 h-3 text-emerald-500" />
                              <span>PUBLISHED · PUBLIC</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-amber-500" />
                              <span>DRAFT · HIDDEN</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <h4 className="font-['Cinzel_Decorative'] text-lg font-black leading-snug">
                          {hb.title}
                        </h4>
                        {hb.subtitle && (
                          <p className="font-['Marcellus'] text-xs italic text-[#D4A72C] mt-1">
                            {hb.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Summary */}
                      <p className="font-['Marcellus'] text-xs text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-3">
                        {hb.summary}
                      </p>

                      {/* Topics pills */}
                      {Array.isArray(hb.topics) && hb.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {hb.topics.slice(0, 3).map((top, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-stone-500/10 text-stone-600 dark:text-stone-400 font-serif"
                            >
                              {top}
                            </span>
                          ))}
                          {hb.topics.length > 3 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md text-stone-400 font-serif">
                              +{hb.topics.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* File Details Box */}
                      <div
                        className={`p-3.5 rounded-xl border text-xs font-serif space-y-1.5 ${
                          isLight
                            ? 'bg-amber-50/60 border-amber-200/60 text-stone-800'
                            : 'bg-black/30 border-[#D4A72C]/20 text-[#E8D3A8]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="opacity-75">PDF Status:</span>
                          <span className="font-bold flex items-center gap-1">
                            {hb.hasCustomPdf ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                                <span className="text-[#22C55E]">Custom Upload</span>
                              </>
                            ) : (
                              <>
                                <Shield className="w-3.5 h-3.5 text-[#D4A72C]" />
                                <span>Official Shastric Edition</span>
                              </>
                            )}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="opacity-75">Active File:</span>
                          <span className="font-mono text-[10px] truncate max-w-[160px]" title={hb.pdfFileName || ''}>
                            {hb.pdfFileName || 'official-handbook.pdf'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="opacity-75">Folio Size & Pages:</span>
                          <span className="font-bold">{hb.pages} Pages ({fileSizeFormatted})</span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-current/10">
                          <span className="opacity-75">Client Leads Captured:</span>
                          <span className="font-bold text-[#E88A16]">{hb.leadCount || 0} Inquiries</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                      {/* Upload / Replace Button */}
                      <button
                        onClick={() => handleTriggerUpload(hb)}
                        disabled={isUploadingThis}
                        className={`w-full py-2.5 px-4 rounded-xl font-serif text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                          isUploadingThis
                            ? 'bg-amber-600/50 text-white cursor-wait'
                            : isLight
                            ? 'bg-[#6B1F1F] hover:bg-[#8B2B2B] text-[#FFF7ED]'
                            : 'bg-gradient-to-r from-[#E88A16] to-[#B94E2C] hover:brightness-110 text-[#2D1B14]'
                        }`}
                      >
                        {isUploadingThis ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>{uploadProgress || 'Uploading PDF...'}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>{hb.hasCustomPdf ? 'Replace PDF Document' : 'Upload Custom PDF'}</span>
                          </>
                        )}
                      </button>

                      <div className="grid grid-cols-3 gap-2">
                        {/* Preview in embedded admin modal */}
                        <button
                          onClick={() => setPreviewHandbook(hb)}
                          className={`py-2 px-2.5 rounded-xl border text-xs font-serif font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                            isLight
                              ? 'border-stone-300 hover:bg-stone-100 text-stone-700'
                              : 'border-stone-700 hover:bg-white/10 text-stone-200'
                          }`}
                          title="Preview in reader"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>

                        {/* Edit metadata */}
                        <button
                          onClick={() => handleOpenEdit(hb)}
                          className={`py-2 px-2.5 rounded-xl border text-xs font-serif font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                            isLight
                              ? 'border-stone-300 hover:bg-stone-100 text-stone-700'
                              : 'border-stone-700 hover:bg-white/10 text-stone-200'
                          }`}
                          title="Edit details & mode"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {/* Delete handbook */}
                        <button
                          onClick={() => handleDeleteHandbook(hb)}
                          className="py-2 px-2.5 rounded-xl border border-red-500/30 hover:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-serif font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          title="Delete handbook"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: CLIENT LEADS & CONTACT SUBMISSIONS */}
      {activeSubTab === 'leads' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-['Cinzel',serif] text-lg font-bold">
                Client Contact Details & Reading Inquiries
              </h3>
              <p className="text-xs font-serif text-stone-500">
                Contact submissions gathered from clients who requested access to read authorized handbooks.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-serif font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Leads (CSV)</span>
              </button>

              <button
                onClick={fetchLeads}
                className={`p-2 rounded-xl text-xs font-serif transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isLight ? 'hover:bg-stone-200 text-stone-600' : 'hover:bg-white/10 text-stone-300'
                }`}
                title="Refresh leads list"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div
            className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center gap-3 ${
              isLight ? 'bg-white border-stone-200' : 'bg-[#1E110D] border-stone-800'
            }`}
          >
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchLeadQuery}
                onChange={(e) => setSearchLeadQuery(e.target.value)}
                placeholder="Search by client name, email, mobile number, or handbook..."
                className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm font-['Marcellus'] border transition-all focus:outline-none focus:ring-2 focus:ring-[#D4A72C] ${
                  isLight
                    ? 'bg-stone-50 border-stone-300 text-stone-900 placeholder:text-stone-400'
                    : 'bg-stone-900 border-stone-700 text-stone-100 placeholder:text-stone-500'
                }`}
              />
            </div>

            <div className="w-full md:w-64">
              <select
                value={selectedHandbookFilter}
                onChange={(e) => setSelectedHandbookFilter(e.target.value)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-['Marcellus'] border transition-all focus:outline-none focus:ring-2 focus:ring-[#D4A72C] ${
                  isLight
                    ? 'bg-stone-50 border-stone-300 text-stone-900'
                    : 'bg-stone-900 border-stone-700 text-stone-100'
                }`}
              >
                <option value="">All Handbooks</option>
                {handbooks.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Leads Table */}
          {loadingLeads ? (
            <div className="p-12 text-center font-serif text-sm text-stone-500">
              Loading client submissions...
            </div>
          ) : leads.length === 0 ? (
            <div
              className={`p-12 text-center font-serif text-sm rounded-2xl border border-dashed ${
                isLight ? 'bg-white border-stone-300 text-stone-500' : 'bg-[#1E110D] border-stone-800 text-stone-400'
              }`}
            >
              <Users className="w-10 h-10 text-stone-400 mx-auto mb-2 opacity-50" />
              <p className="font-bold">No client contact submissions found.</p>
              <p className="text-xs opacity-75 mt-1">
                When visitors click “Read Handbook” on the website and submit their email and mobile number, they will appear here immediately.
              </p>
            </div>
          ) : (
            <div
              className={`rounded-2xl border overflow-hidden shadow-sm ${
                isLight ? 'bg-white border-stone-200' : 'bg-[#1E110D] border-stone-800'
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-serif">
                  <thead
                    className={`border-b uppercase tracking-wider text-[10px] font-bold ${
                      isLight ? 'bg-stone-50 border-stone-200 text-stone-600' : 'bg-stone-900/60 border-stone-800 text-stone-400'
                    }`}
                  >
                    <tr>
                      <th className="py-3 px-4">Client Contact</th>
                      <th className="py-3 px-4">Handbook Requested</th>
                      <th className="py-3 px-4">Submission Date</th>
                      <th className="py-3 px-4">Quick Outreach</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                    {leads.map((lead) => {
                      const cleanPhone = lead.mobileNumber.replace(/\D/g, '');
                      const formattedDate = new Date(lead.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });

                      return (
                        <tr
                          key={lead.id}
                          className={`hover:bg-amber-500/5 transition-colors ${
                            isLight ? 'text-stone-900' : 'text-[#FFF7ED]'
                          }`}
                        >
                          <td className="py-3 px-4 space-y-1">
                            <div className="flex items-center gap-1.5 font-bold">
                              <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                              <span>{lead.fullName || 'Prospective Client'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 font-mono text-[11px]">
                              <Mail className="w-3 h-3 text-[#E88A16] shrink-0" />
                              <a href={`mailto:${lead.email}`} className="hover:underline">
                                {lead.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 font-mono text-[11px]">
                              <Phone className="w-3 h-3 text-emerald-500 shrink-0" />
                              <a href={`tel:${lead.mobileNumber}`} className="hover:underline">
                                {lead.mobileNumber}
                              </a>
                            </div>
                          </td>

                          <td className="py-3 px-4 font-['Marcellus'] font-bold text-xs max-w-xs">
                            <div className="truncate" title={lead.handbookTitle}>
                              {lead.handbookTitle}
                            </div>
                            <span className="text-[10px] text-stone-400 font-serif block">
                              IP: {lead.ipAddress || 'Verified session'}
                            </span>
                          </td>

                          <td className="py-3 px-4 font-mono text-[11px] text-stone-500 dark:text-stone-400">
                            {formattedDate}
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <a
                                href={`mailto:${lead.email}?subject=${encodeURIComponent(
                                  `Vastu Consultation Regarding: ${lead.handbookTitle}`
                                )}`}
                                className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-[#E88A16] transition-colors"
                                title="Compose Email"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </a>

                              <a
                                href={`tel:${lead.mobileNumber}`}
                                className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 transition-colors"
                                title="Call Client"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>

                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                    `Namaste! Thank you for requesting the "${lead.handbookTitle}" from Vastu Ritam. We would be pleased to answer any questions on your floor plan or property.`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 transition-colors"
                                  title="Message on WhatsApp"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: CREATE NEW HANDBOOK MODAL (WITH DRAFT / PUBLISH MODE SELECTION) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div
            className={`w-full max-w-xl rounded-2xl shadow-2xl border p-6 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto ${
              isLight
                ? 'bg-[#FFFDF9] border-[#D4A72C]/70 text-stone-900'
                : 'bg-[#1E110D] border-[#D4A72C]/70 text-[#FFF7ED]'
            }`}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] uppercase font-serif tracking-widest text-[#E88A16] font-bold">
                  Canonical Treatise Creator
                </span>
                <h3 className="font-['Cinzel_Decorative'] text-xl font-black">
                  Add New Handbook
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-stone-500/10 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHandbookSubmit} className="space-y-4 text-xs font-serif">
              {/* Publication Mode Selector (Draft vs Publish) */}
              <div className="space-y-1.5">
                <label className="block font-bold text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Publication Mode (Public Visibility) *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Draft Mode Card */}
                  <div
                    onClick={() => setCreateFormData({ ...createFormData, status: 'draft' })}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                      createFormData.status === 'draft'
                        ? 'border-amber-500 bg-amber-500/10 shadow-sm'
                        : isLight
                        ? 'border-stone-200 bg-stone-50 hover:border-stone-300'
                        : 'border-stone-800 bg-black/30 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300">
                        <EyeOff className="w-4 h-4 text-amber-500" />
                        <span>Draft Mode</span>
                      </span>
                      <input
                        type="radio"
                        name="create-mode"
                        checked={createFormData.status === 'draft'}
                        onChange={() => setCreateFormData({ ...createFormData, status: 'draft' })}
                        className="cursor-pointer"
                      />
                    </div>
                    <p className="text-[11px] opacity-75 leading-tight">
                      Hidden from website visitors. Only admins can view, upload, and test this handbook.
                    </p>
                  </div>

                  {/* Published Mode Card */}
                  <div
                    onClick={() => setCreateFormData({ ...createFormData, status: 'published' })}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                      createFormData.status === 'published'
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                        : isLight
                        ? 'border-stone-200 bg-stone-50 hover:border-stone-300'
                        : 'border-stone-800 bg-black/30 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300">
                        <Globe className="w-4 h-4 text-emerald-500" />
                        <span>Published Mode</span>
                      </span>
                      <input
                        type="radio"
                        name="create-mode"
                        checked={createFormData.status === 'published'}
                        onChange={() => setCreateFormData({ ...createFormData, status: 'published' })}
                        className="cursor-pointer"
                      />
                    </div>
                    <p className="text-[11px] opacity-75 leading-tight">
                      Immediately visible to clients on the website in Gyan Kosh under Classical Handbooks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold mb-1">Handbook Title *</label>
                <input
                  type="text"
                  required
                  value={createFormData.title}
                  onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })}
                  placeholder="e.g. Vastu Guidelines for Commercial Sanctuaries"
                  className="w-full p-2.5 rounded-xl border bg-transparent font-['Marcellus'] text-sm"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block font-bold mb-1">Subtitle / Descriptor</label>
                <input
                  type="text"
                  value={createFormData.subtitle}
                  onChange={(e) => setCreateFormData({ ...createFormData, subtitle: e.target.value })}
                  placeholder="e.g. A Comprehensive Manual for Real Estate Developers & Builders"
                  className="w-full p-2.5 rounded-xl border bg-transparent font-['Marcellus'] text-xs"
                />
              </div>

              {/* Target Audience & Pages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Target Audience Domain *</label>
                  <input
                    type="text"
                    required
                    value={createFormData.targetAudience}
                    onChange={(e) => setCreateFormData({ ...createFormData, targetAudience: e.target.value })}
                    placeholder="e.g. Architects & Structural Engineers"
                    className="w-full p-2.5 rounded-xl border bg-transparent"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Folio Pages Count</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={500}
                    value={createFormData.pages}
                    onChange={(e) => setCreateFormData({ ...createFormData, pages: parseInt(e.target.value, 10) || 40 })}
                    className="w-full p-2.5 rounded-xl border bg-transparent"
                  />
                </div>
              </div>

              {/* Summary / Scope */}
              <div>
                <label className="block font-bold mb-1">Treatise Summary & Scope *</label>
                <textarea
                  rows={3}
                  required
                  value={createFormData.summary}
                  onChange={(e) => setCreateFormData({ ...createFormData, summary: e.target.value })}
                  placeholder="Summarize the core architectural scope and practical value of this handbook for readers..."
                  className="w-full p-2.5 rounded-xl border bg-transparent font-['Marcellus']"
                />
              </div>

              {/* Topics list */}
              <div>
                <label className="block font-bold mb-1">Included Modules / Topics (comma-separated)</label>
                <input
                  type="text"
                  value={createFormData.topicsInput}
                  onChange={(e) => setCreateFormData({ ...createFormData, topicsInput: e.target.value })}
                  placeholder="e.g. Solar Vector Alignment, Brahmasthan Protection, Ayadi Formulas, Non-Destructive Layouts"
                  className="w-full p-2.5 rounded-xl border bg-transparent"
                />
              </div>

              {/* Attach PDF File (Optional during creation) */}
              <div
                className={`p-3.5 rounded-xl border border-dashed space-y-2 ${
                  isLight ? 'bg-amber-50/50 border-amber-300' : 'bg-black/30 border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileUp className="w-4 h-4 text-[#E88A16]" />
                    <span className="font-bold text-xs">PDF Document File</span>
                  </div>
                  {createPdfFile && (
                    <button
                      type="button"
                      onClick={() => setCreatePdfFile(null)}
                      className="text-[11px] text-red-500 hover:underline cursor-pointer"
                    >
                      Remove File
                    </button>
                  )}
                </div>

                <input
                  ref={createFileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      if (!f.name.toLowerCase().endsWith('.pdf')) {
                        showNotify('error', 'Only authentic PDF documents (.pdf) can be attached.');
                        return;
                      }
                      if (f.size > 35 * 1024 * 1024) {
                        showNotify('error', 'PDF file exceeds 35MB maximum limit.');
                        return;
                      }
                      setCreatePdfFile(f);
                    }
                  }}
                />

                {createPdfFile ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
                    <span className="font-mono text-xs truncate max-w-xs">{createPdfFile.name}</span>
                    <span className="text-[11px] font-bold">{(createPdfFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <button
                      type="button"
                      onClick={() => createFileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-lg border border-amber-500/40 hover:bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose PDF File (Optional)</span>
                    </button>
                    <p className="text-[11px] opacity-70 mt-1">
                      If skipped, an authentic compiled shastric monograph will be auto-generated automatically. You can also upload a PDF anytime later.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border font-bold cursor-pointer hover:bg-stone-500/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className={`px-5 py-2 rounded-xl font-bold text-white shadow-md flex items-center gap-2 cursor-pointer transition-all ${
                    isCreating
                      ? 'bg-stone-500 cursor-not-allowed opacity-75'
                      : createFormData.status === 'published'
                      ? 'bg-emerald-700 hover:bg-emerald-600'
                      : 'bg-[#6B1F1F] hover:bg-[#8B2B2B]'
                  }`}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Handbook...</span>
                    </>
                  ) : (
                    <>
                      <span>{createFormData.status === 'published' ? 'Create & Publish Publicly' : 'Create in Draft Mode'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADMIN PREVIEW EMBEDDED VIEWER */}
      {previewHandbook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div
            className={`w-full max-w-5xl h-[88vh] rounded-2xl shadow-2xl border flex flex-col overflow-hidden ${
              isLight
                ? 'bg-white border-[#D4A72C]/50 text-stone-900'
                : 'bg-[#180E0A] border-[#D4A72C]/50 text-[#FFF7ED]'
            }`}
          >
            <div className="px-6 py-3.5 border-b flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-[#D4A72C]" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-['Cinzel',serif] text-base font-bold">
                      Admin Preview: {previewHandbook.title}
                    </h3>
                    <span
                      className={`text-[10px] font-serif font-bold px-2 py-0.2 rounded-full ${
                        previewHandbook.status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-600'
                          : 'bg-amber-500/20 text-amber-600'
                      }`}
                    >
                      {previewHandbook.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs font-serif text-stone-500">
                    File: {previewHandbook.pdfFileName || 'official-handbook.pdf'} ({previewHandbook.pages} Folio Pages)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewHandbook(null)}
                className="p-2 rounded-xl hover:bg-red-500/10 text-red-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 w-full h-full bg-[#1A1A1A]">
              <iframe
                src={`/api/handbooks/stream/${encodeURIComponent(previewHandbook.id)}#toolbar=1&navpanes=1`}
                className="w-full h-full border-0"
                title={`Admin Preview: ${previewHandbook.title}`}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT METADATA & MODE MODAL */}
      {editingHandbook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div
            className={`w-full max-w-lg rounded-2xl shadow-2xl border p-6 space-y-4 max-h-[90vh] overflow-y-auto ${
              isLight
                ? 'bg-[#FFFDF9] border-[#D4A72C]/60 text-stone-900'
                : 'bg-[#1E110D] border-[#D4A72C]/60 text-[#FFF7ED]'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] uppercase font-serif tracking-widest text-[#E88A16] font-bold">
                  Handbook Editor
                </span>
                <h3 className="font-['Cinzel',serif] text-lg font-bold">
                  Edit Handbook & Visibility Mode
                </h3>
              </div>
              <button
                onClick={() => setEditingHandbook(null)}
                className="p-1 rounded-lg hover:bg-stone-500/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-serif">
              {/* Publication Mode Selector (Draft vs Publish) */}
              <div className="space-y-1.5">
                <label className="block font-bold text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Publication Mode *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setEditFormData({ ...editFormData, status: 'draft' })}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-1 ${
                      editFormData.status === 'draft'
                        ? 'border-amber-500 bg-amber-500/10'
                        : isLight
                        ? 'border-stone-200 bg-stone-50'
                        : 'border-stone-800 bg-black/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300">
                        <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                        <span>Draft (Hidden)</span>
                      </span>
                      <input
                        type="radio"
                        name="edit-mode"
                        checked={editFormData.status === 'draft'}
                        onChange={() => setEditFormData({ ...editFormData, status: 'draft' })}
                        className="cursor-pointer"
                      />
                    </div>
                    <p className="text-[10px] opacity-75">Hidden from public website</p>
                  </div>

                  <div
                    onClick={() => setEditFormData({ ...editFormData, status: 'published' })}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-1 ${
                      editFormData.status === 'published'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : isLight
                        ? 'border-stone-200 bg-stone-50'
                        : 'border-stone-800 bg-black/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300">
                        <Globe className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Published (Public)</span>
                      </span>
                      <input
                        type="radio"
                        name="edit-mode"
                        checked={editFormData.status === 'published'}
                        onChange={() => setEditFormData({ ...editFormData, status: 'published' })}
                        className="cursor-pointer"
                      />
                    </div>
                    <p className="text-[10px] opacity-75">Live on public website</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Handbook Title</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border bg-transparent text-sm"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Subtitle / Descriptor</label>
                <input
                  type="text"
                  value={editFormData.subtitle}
                  onChange={(e) => setEditFormData({ ...editFormData, subtitle: e.target.value })}
                  className="w-full p-2.5 rounded-xl border bg-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Target Audience</label>
                  <input
                    type="text"
                    required
                    value={editFormData.targetAudience}
                    onChange={(e) => setEditFormData({ ...editFormData, targetAudience: e.target.value })}
                    className="w-full p-2.5 rounded-xl border bg-transparent"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Folio Pages Count</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={500}
                    value={editFormData.pages}
                    onChange={(e) => setEditFormData({ ...editFormData, pages: parseInt(e.target.value, 10) || 40 })}
                    className="w-full p-2.5 rounded-xl border bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Treatise Summary / Scope</label>
                <textarea
                  rows={3}
                  required
                  value={editFormData.summary}
                  onChange={(e) => setEditFormData({ ...editFormData, summary: e.target.value })}
                  className="w-full p-2.5 rounded-xl border bg-transparent"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Modules / Topics (comma-separated)</label>
                <input
                  type="text"
                  value={editFormData.topicsInput}
                  onChange={(e) => setEditFormData({ ...editFormData, topicsInput: e.target.value })}
                  className="w-full p-2.5 rounded-xl border bg-transparent"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setEditingHandbook(null)}
                  className="px-4 py-2 rounded-xl border font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6B1F1F] text-[#FFF7ED] font-bold cursor-pointer hover:bg-[#8B2B2B]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
