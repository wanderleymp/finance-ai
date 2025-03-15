import { SetMetadata } from '@nestjs/common';

/**
 * Decorador para verificar se o usuário possui um determinado perfil
 * 
 * Este decorador é utilizado em conjunto com o PerfilGuard para
 * proteger rotas que requerem um perfil específico.
 * 
 * @param perfilNome Nome do perfil requerido
 * @returns Decorador para verificação de perfil
 */
export const RequirePerfil = (perfilNome: string) => SetMetadata('perfil_requerido', perfilNome);
