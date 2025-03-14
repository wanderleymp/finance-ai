import { IStorageProvider, IFileMetadata } from '../../interfaces/IStorageProvider';
import * as AWS from 'aws-sdk';

/**
 * Interface para o resultado do upload no S3
 */
interface IS3UploadResult {
  Location: string;
  ETag: string;
  Bucket: string;
  Key: string;
  VersionId?: string;
}

/**
 * Implementação do provedor de armazenamento usando AWS S3
 * 
 * Esta classe implementa a interface IStorageProvider para fornecer
 * acesso ao serviço de armazenamento AWS S3.
 */
export class S3Provider implements IStorageProvider {
  private s3: AWS.S3;
  private bucket: string;
  private static instance: S3Provider;

  constructor() {
    // Configuração do cliente S3
    this.s3 = new AWS.S3({
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    this.bucket = process.env.AWS_S3_BUCKET || '';
    
    if (!this.bucket) {
      console.warn('AWS_S3_BUCKET não está definido. O provedor S3 não funcionará corretamente.');
    }
  }

  /**
   * Obtém uma instância singleton do provedor S3
   * @returns Instância do S3Provider
   */
  public static getInstance(): S3Provider {
    if (!S3Provider.instance) {
      S3Provider.instance = new S3Provider();
    }
    return S3Provider.instance;
  }

  /**
   * Faz upload de um arquivo para o S3
   * @param file Buffer contendo os dados do arquivo
   * @param path Caminho onde o arquivo será armazenado
   * @param metadata Metadados opcionais do arquivo
   * @returns Metadados do arquivo armazenado
   */
  async upload(file: Buffer, path: string, metadata?: Partial<IFileMetadata>): Promise<IFileMetadata> {
    try {
      // Configuração dos parâmetros de upload
      const params = {
        Bucket: this.bucket,
        Key: path,
        Body: file,
        ContentType: metadata?.mimetype || 'application/octet-stream',
      };

      // Execução do upload
      const result = await this.s3.upload(params).promise() as IS3UploadResult;
      
      // Retorno dos metadados do arquivo
      return {
        filename: path.split('/').pop() || '',
        mimetype: metadata?.mimetype || 'application/octet-stream',
        size: file.length,
        path: path,
        url: result.Location,
        createdAt: new Date(),
        metadata: {
          etag: result.ETag,
          versionId: result.VersionId || null,
        },
      };
    } catch (error) {
      console.error('Erro ao fazer upload para o S3:', error);
      throw error;
    }
  }

  /**
   * Faz download de um arquivo do S3
   * @param path Caminho do arquivo a ser baixado
   * @returns Buffer contendo os dados do arquivo
   */
  async download(path: string): Promise<Buffer> {
    try {
      // Configuração dos parâmetros de download
      const params = {
        Bucket: this.bucket,
        Key: path,
      };

      // Execução do download
      const result = await this.s3.getObject(params).promise();
      
      // Retorno do conteúdo do arquivo
      return result.Body as Buffer;
    } catch (error) {
      console.error('Erro ao fazer download do S3:', error);
      throw error;
    }
  }

  /**
   * Remove um arquivo do S3
   * @param path Caminho do arquivo a ser removido
   */
  async delete(path: string): Promise<void> {
    try {
      // Configuração dos parâmetros de exclusão
      const params = {
        Bucket: this.bucket,
        Key: path,
      };

      // Execução da exclusão
      await this.s3.deleteObject(params).promise();
    } catch (error) {
      console.error('Erro ao excluir arquivo do S3:', error);
      throw error;
    }
  }

  /**
   * Obtém a URL para acesso ao arquivo
   * @param path Caminho do arquivo
   * @returns URL do arquivo
   */
  async getUrl(path: string): Promise<string> {
    try {
      // Configuração dos parâmetros para gerar URL
      const params = {
        Bucket: this.bucket,
        Key: path,
        Expires: 3600, // URL válida por 1 hora
      };

      // Geração da URL assinada
      return this.s3.getSignedUrlPromise('getObject', params);
    } catch (error) {
      console.error('Erro ao gerar URL do S3:', error);
      throw error;
    }
  }

  /**
   * Verifica se um arquivo existe no S3
   * @param path Caminho do arquivo
   * @returns Boolean indicando se o arquivo existe
   */
  async exists(path: string): Promise<boolean> {
    try {
      // Configuração dos parâmetros para verificar existência
      const params = {
        Bucket: this.bucket,
        Key: path,
      };

      // Tentativa de obter os metadados do arquivo
      await this.s3.headObject(params).promise();
      return true;
    } catch (error) {
      // Se o erro for 404, o arquivo não existe
      if (error.code === 'NotFound') {
        return false;
      }
      // Para outros erros, propagamos a exceção
      console.error('Erro ao verificar existência no S3:', error);
      throw error;
    }
  }
}
