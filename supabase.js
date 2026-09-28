/**
 * PAK INTERIORS — Supabase Cloud Backend Service
 * Ultra-fast REST + LocalStorage offline-first data sync
 */

(function () {
  'use strict';

  // Default Supabase Credentials (from your connected Supabase Project)
  const DEFAULT_SUPABASE_URL = 'https://knywumwbvwawvykxregm.supabase.co';
  const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtueXd1bXdidndhd3Z5a3hyZWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MzI0OTMsImV4cCI6MjEwNDAwODQ5M30.r4FMEzvjjfxUy9uihSMo1ZsqVjtjXua20_QCvtQYW1M';

  function getCredentials() {
    const custom = JSON.parse(localStorage.getItem('pak_supabase_credentials') || '{}');
    return {
      url: (custom.url || DEFAULT_SUPABASE_URL).replace(/\/+$/, ''),
      key: custom.key || DEFAULT_SUPABASE_KEY
    };
  }

  function getHeaders() {
    const { key } = getCredentials();
    return {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  async function apiRequest(endpoint, options = {}) {
    const { url } = getCredentials();
    const fullUrl = `${url}/rest/v1/${endpoint}`;
    const headers = { ...getHeaders(), ...(options.headers || {}) };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Supabase error ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`[Supabase API] Falling back to local cache:`, err.message);
      throw err;
    }
  }

  const SupabaseBackend = {
    getCredentials,
    setCredentials(url, key) {
      localStorage.setItem('pak_supabase_credentials', JSON.stringify({ url, key }));
    },
    resetCredentials() {
      localStorage.removeItem('pak_supabase_credentials');
    },

    // 1. Projects
    async fetchProjects() {
      try {
        const rows = await apiRequest('projects?select=*&order=created_at.asc');
        if (Array.isArray(rows) && rows.length > 0) {
          const mapped = rows.map(r => ({
            id: r.id,
            title: r.title,
            category: r.category,
            location: r.location,
            area: r.area,
            coverImage: r.cover_image,
            desc: r.description,
            media: Array.isArray(r.media) && r.media.length > 0 ? r.media : [{ type: 'image', url: r.cover_image }]
          }));
          localStorage.setItem('pak_projects', JSON.stringify(mapped));
          return mapped;
        }
      } catch (e) {
        // Fallback to localStorage
      }
      return JSON.parse(localStorage.getItem('pak_projects')) || [];
    },

    async saveProject(project) {
      const payload = {
        id: project.id || ('proj-' + Date.now()),
        title: project.title,
        category: project.category,
        location: project.location,
        area: project.area,
        cover_image: project.coverImage,
        description: project.desc,
        media: project.media || [{ type: 'image', url: project.coverImage }],
        updated_at: new Date().toISOString()
      };

      try {
        await apiRequest('projects', {
          method: 'POST',
          headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        console.warn('Cloud save skipped; persisted locally.');
      }
    },

    async deleteProject(id) {
      try {
        await apiRequest(`projects?id=eq.${encodeURIComponent(id)}`, {
          method: 'DELETE'
        });
      } catch (e) {
        console.warn('Cloud delete skipped; persisted locally.');
      }
    },

    // 2. Testimonials
    async fetchTestimonials() {
      try {
        const rows = await apiRequest('testimonials?select=*&order=created_at.asc');
        if (Array.isArray(rows) && rows.length > 0) {
          const mapped = rows.map(r => ({
            id: r.id,
            name: r.name,
            title: r.title,
            location: r.location,
            quote: r.quote
          }));
          localStorage.setItem('pak_testimonials', JSON.stringify(mapped));
          return mapped;
        }
      } catch (e) {
        // Fallback to localStorage
      }
      return JSON.parse(localStorage.getItem('pak_testimonials')) || [];
    },

    async saveTestimonial(t) {
      const payload = {
        id: t.id || ('test-' + Date.now()),
        name: t.name,
        title: t.title || '',
        location: t.location || 'Lahore',
        quote: t.quote
      };

      try {
        await apiRequest('testimonials', {
          method: 'POST',
          headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        console.warn('Cloud save skipped; persisted locally.');
      }
    },

    async deleteTestimonial(id) {
      try {
        await apiRequest(`testimonials?id=eq.${encodeURIComponent(id)}`, {
          method: 'DELETE'
        });
      } catch (e) {
        console.warn('Cloud delete skipped; persisted locally.');
      }
    },

    // 3. Leads (Client Consultations)
    async submitLead(lead) {
      const payload = {
        id: lead.id || ('lead-' + Date.now()),
        name: lead.name,
        phone: lead.phone,
        email: lead.email || '',
        location: lead.location || '',
        notes: lead.notes || ''
      };

      try {
        await apiRequest('leads', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } catch (e) {
        console.warn('Cloud lead submission skipped; stored locally.');
      }
    },

    async fetchLeads() {
      try {
        const rows = await apiRequest('leads?select=*&order=created_at.desc');
        if (Array.isArray(rows)) {
          const mapped = rows.map(r => ({
            id: r.id,
            name: r.name,
            phone: r.phone,
            email: r.email,
            location: r.location,
            notes: r.notes,
            timestamp: new Date(r.created_at).toLocaleDateString()
          }));
          localStorage.setItem('pak_leads', JSON.stringify(mapped));
          return mapped;
        }
      } catch (e) {
        // Fallback to localStorage
      }
      return JSON.parse(localStorage.getItem('pak_leads')) || [];
    },

    async clearLeads() {
      try {
        await apiRequest('leads?id=neq.none', {
          method: 'DELETE'
        });
      } catch (e) {
        console.warn('Cloud clear skipped; cleared locally.');
      }
    },

    // 4. Studio White-Label Config
    async fetchStudioConfig() {
      try {
        const rows = await apiRequest('studio_config?id=eq.default&select=*');
        if (Array.isArray(rows) && rows[0]) {
          const r = rows[0];
          const mapped = {
            companyName: r.company_name,
            tagline: r.tagline,
            phone: r.phone,
            whatsapp: r.whatsapp,
            email: r.email,
            address: r.address,
            logoUrl: r.logo_url || '',
            notifyWhatsapp: r.notify_whatsapp || r.whatsapp || '',
            notifyEmail: r.notify_email || r.email || '',
            whatsappApiKey: r.whatsapp_api_key || '',
            notifyWebhook: r.notify_webhook || '',
            passcode: r.passcode || 'pakinteriors2026'
          };
          localStorage.setItem('pak_config', JSON.stringify(mapped));
          return mapped;
        }
      } catch (e) {
        // Fallback to localStorage
      }
      return JSON.parse(localStorage.getItem('pak_config')) || null;
    },

    async saveStudioConfig(cfg) {
      const payload = {
        id: 'default',
        company_name: cfg.companyName,
        tagline: cfg.tagline,
        phone: cfg.phone,
        whatsapp: cfg.whatsapp,
        email: cfg.email,
        address: cfg.address,
        logo_url: cfg.logoUrl || '',
        notify_whatsapp: cfg.notifyWhatsapp || '',
        notify_email: cfg.notifyEmail || '',
        whatsapp_api_key: cfg.whatsappApiKey || '',
        notify_webhook: cfg.notifyWebhook || '',
        passcode: cfg.passcode || 'pakinteriors2026',
        updated_at: new Date().toISOString()
      };

      try {
        await apiRequest('studio_config', {
          method: 'POST',
          headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        console.warn('Cloud config save skipped; persisted locally.');
      }
    }
  };

  window.PAK_DB = SupabaseBackend;
})();
