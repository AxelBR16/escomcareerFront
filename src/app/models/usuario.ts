export interface Usuario {
  nombre: String,
  apellido: String,
  email: String
  password: String,
  role: Role
}

export interface Role {
  id: number,
  roleName: string
}
