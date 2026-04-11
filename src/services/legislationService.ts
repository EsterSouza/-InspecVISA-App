import { supabase } from '../lib/supabase';

export interface Legislation {
  id: string;
  name: string;
  summary?: string;
  url?: string;
  created_at: string;
}

export class LegislationService {
  static async listLegislations() {
    const { data, error } = await supabase
      .from('legislations')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as Legislation[];
  }

  static async saveLegislation(legislation: Partial<Legislation>) {
    const { data, error } = await supabase
      .from('legislations')
      .upsert({
        ...legislation,
        name: legislation.name?.trim()
      })
      .select()
      .single();

    if (error) throw error;
    return data as Legislation;
  }

  static async deleteLegislation(id: string) {
    const { error } = await supabase
      .from('legislations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  /**
   * Tenta encontrar legislações citadas em um texto
   */
  static async findLegislationsInText(text: string) {
    const legislations = await this.listLegislations();
    // Procura por nomes de leis no texto (ex: RDC 63/2011)
    return legislations.filter(leg => 
      text.toLowerCase().includes(leg.name.toLowerCase())
    );
  }
}
