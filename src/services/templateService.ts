import { supabase } from '../lib/supabase';
import type { ChecklistTemplate, ClientCategory } from '../types';

interface RawImportItem {
  section?: string;
  description: string;
  legislation?: string;
  weight?: number;
  isCritical?: boolean;
}

export const TemplateService = {
  async listTemplates() {
    const { data, error } = await supabase
      .from('checklist_templates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getFullTemplate(templateId: string): Promise<ChecklistTemplate> {
    // Fetch template
    const { data: template, error: tError } = await supabase
      .from('checklist_templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (tError) throw tError;

    // Fetch sections
    const { data: sections, error: sError } = await supabase
      .from('checklist_sections')
      .select('*')
      .eq('template_id', templateId)
      .order('order', { ascending: true });
    
    if (sError) throw sError;

    // Fetch items for each section
    const fullSections = await Promise.all(
      sections.map(async (sec) => {
        const { data: items, error: iError } = await supabase
          .from('checklist_items')
          .select('*')
          .eq('section_id', sec.id)
          .order('order', { ascending: true });
        
        if (iError) throw iError;
        return { ...sec, items };
      })
    );

    return { ...template, sections: fullSections };
  },

  async createTemplate(template: Omit<ChecklistTemplate, 'id' | 'sections'>) {
    const { data, error } = await supabase
      .from('checklist_templates')
      .insert(template)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async saveFullTemplate(templateName: string, category: ClientCategory, rawData: RawImportItem[]) {
    // 1. Create Template
    const template = await this.createTemplate({ name: templateName, category, version: new Date().getFullYear().toString() });

    // 2. Group items by section
    const sectionsMap = new Map<string, RawImportItem[]>();
    rawData.forEach(item => {
      const sectionTitle = item.section || 'Geral';
      if (!sectionsMap.has(sectionTitle)) sectionsMap.set(sectionTitle, []);
      sectionsMap.get(sectionTitle)?.push(item);
    });

    // 3. Create Sections and Items
    let sectionOrder = 1;
    for (const [title, items] of sectionsMap.entries()) {
      const { data: section, error: sError } = await supabase
        .from('checklist_sections')
        .insert({ template_id: template.id, title, order: sectionOrder++ })
        .select()
        .single();
      
      if (sError) throw sError;

      const itemsToInsert = items.map((it, idx) => ({
        section_id: section.id,
        description: it.description,
        legislation_name: it.legislation,
        weight: it.weight || 1,
        is_critical: it.isCritical || false,
        order: idx + 1
      }));

      const { error: iError } = await supabase
        .from('checklist_items')
        .insert(itemsToInsert);
      
      if (iError) throw iError;
    }

    return template;
  }
};
