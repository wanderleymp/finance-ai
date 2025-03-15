/**
 * Utilitário para tratamento de erros
 * 
 * Funções auxiliares para lidar com erros de forma segura,
 * especialmente com tipos 'unknown' do TypeScript.
 */

/**
 * Extrai a mensagem de erro de um objeto de erro desconhecido
 * 
 * @param error Objeto de erro (potencialmente unknown)
 * @param defaultMessage Mensagem padrão caso não seja possível extrair
 * @returns Mensagem de erro formatada
 */
export function extrairMensagemErro(error: unknown, defaultMessage = 'Ocorreu um erro inesperado'): string {
  if (error === null || error === undefined) {
    return defaultMessage;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
    
    if ('erro' in error && typeof error.erro === 'string') {
      return error.erro;
    }
    
    if ('error' in error && typeof error.error === 'string') {
      return error.error;
    }
    
    try {
      return JSON.stringify(error);
    } catch {
      // Se não for possível serializar o objeto
      return defaultMessage;
    }
  }
  
  return String(error);
}

/**
 * Verifica se um erro é de um determinado tipo
 * 
 * @param error Objeto de erro (potencialmente unknown)
 * @param errorType Nome do tipo de erro a verificar
 * @returns Verdadeiro se o erro for do tipo especificado
 */
export function isErrorOfType(error: unknown, errorType: string): boolean {
  if (error === null || error === undefined) {
    return false;
  }
  
  if (typeof error !== 'object') {
    return false;
  }
  
  if ('name' in error && typeof error.name === 'string') {
    return error.name === errorType;
  }
  
  if ('constructor' in error && typeof error.constructor === 'function' && 'name' in error.constructor) {
    return error.constructor.name === errorType;
  }
  
  return false;
}
