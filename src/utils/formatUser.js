export const formatUser = user => {
  if (!user) return 'Desconocido';
  return user.split('@')[0];
}