export function ensureRole(role: 'PROFESSOR' | 'ALUNO') {
  return (req: any, res: any, next: any) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return next();
  };
}