/**
 * Interface para metadados de arquivo
 * 
 * Esta interface define as propriedades básicas de metadados
 * que qualquer arquivo armazenado deve ter.
 */
export interface IFileMetadata {
  /**
   * Nome do arquivo
   */
  filename: string;
  
  /**
   * Tipo MIME do arquivo
   */
  mimetype: string;
  
  /**
   * Tamanho do arquivo em bytes
   */
  size: number;
  
  /**
   * Caminho do arquivo no sistema de armazenamento
   */
  path?: string;
  
  /**
   * URL para acesso ao arquivo
   */
  url?: string;
  
  /**
   * Data de criação do arquivo
   */
  createdAt?: Date;
  
  /**
   * Metadados adicionais específicos do provedor
   */
  metadata?: Record<string, any>;
}

/**
 * Interface para provedor de armazenamento
 * 
 * Esta interface define os métodos básicos que qualquer provedor
 * de armazenamento deve implementar para ser compatível com a aplicação.
 */
export interface IStorageProvider {
  /**
   * Faz upload de um arquivo para o sistema de armazenamento
   * @param file - Buffer contendo os dados do arquivo
   * @param path - Caminho onde o arquivo será armazenado
   * @param metadata - Metadados opcionais do arquivo
   * @returns Promise com os metadados do arquivo armazenado
   */
  upload(file: Buffer, path: string, metadata?: Partial<IFileMetadata>): Promise<IFileMetadata>;
  
  /**
   * Faz download de um arquivo do sistema de armazenamento
   * @param path - Caminho do arquivo a ser baixado
   * @returns Promise com o buffer contendo os dados do arquivo
   */
  download(path: string): Promise<Buffer>;
  
  /**
   * Remove um arquivo do sistema de armazenamento
   * @param path - Caminho do arquivo a ser removido
   * @returns Promise void
   */
  delete(path: string): Promise<void>;
  
  /**
   * Obtém a URL para acesso ao arquivo
   * @param path - Caminho do arquivo
   * @returns Promise com a URL do arquivo
   */
  getUrl(path: string): Promise<string>;
  
  /**
   * Verifica se um arquivo existe no sistema de armazenamento
   * @param path - Caminho do arquivo
   * @returns Promise com boolean indicando se o arquivo existe
   */
  exists(path: string): Promise<boolean>;
}
