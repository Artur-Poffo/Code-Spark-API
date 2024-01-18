# Separação de requisitos

## RFs

- [ ] Usuário deve poder se cadastrar no sistema como: "Estudante" ou "Instrutor"
- [ ] Usuário deve conseguir se autenticar após o cadastro
- [ ] Instrutores devem conseguir cadastrar cursos na plataforma
- [ ] Instrutores podem cadastrar módulos a um curso
- [ ] Instrutores podem adicionar aulas aos módulos
- [ ] Instrutor responsável pode adicionar "tags" para o seu curso como forma de informar aos estudantes tecnologias presentes no curso
- [ ] instrutores podem fazer upload de vídeos
- [ ] Streaming de vídeos para assistir as aulas
- [ ] Estudantes podem se "inscrever" para participar do curso
- [ ] Estudantes podem marcar aulas como concluídas
- [ ] Deve ser possível filtrar cursos pelo nome ou por "tags"
- [ ] Estudante poder avaliar um determinado curso que ele está fazendo com uma nota de 1 até 5 para depois ter uma note média de cada curso
- [ ] Retornar informações de um usuário
- [ ] Retornar informações de um estudantes com os cursos que está inscrito
- [ ] Retornar informações de um instrutor com os cursos do mesmo
- [ ] Retornar informações de um curso
- [ ] Retornar informações de um curso com seus módulos e aulas

## RNs

- [ ] Usuário não deve poder se cadastrar com o mesmo email
- [ ] Usuário não deve poder se cadastrar com o mesmo cpf

## RNFs

- [ ] Senha do usuário deve ser criptografada
- [ ] Dados da aplicação devem ser persistidos em um banco de dados PostgresSQL com docker
- [ ] Toda listagem de dados deve ser paginada em 20 items por página e ter um atributo de total de items
- [ ] Usuário deve ser identificado por JWT
- [ ] O JWT deve usar o algoritmo RS256