# Sistema de gestão financeira

## 1. Introdução e Motivação
### O desenvolvimento de aplicações web modernas exige que o desenvolvedor saiba integrar diversas camadas: uma interface reativa, uma API segura e um banco de dados persistente. O objetivo deste projeto é construir um Sistema de Gestão Financeira, que simula um cenário real de mercado. Motivação: Gerenciar finanças pessoais não é apenas subtrair despesas de rendas. Envolve lidar com a temporalidade (parcelamentos), diferentes fontes de custeio (cartões vs. dinheiro) e planejamento a longo prazo (reservas e relatórios anuais). Ao concluir este projeto, você terá em seu portfólio uma aplicação robusta que demonstra domínio sobre o fluxo completo de dados em uma arquitetura Next.js

## 2. Requisitos Funcionais
### O sistema deve implementar obrigatoriamente as seguintes interfaces e funcionalidades:

#### 2.1 Módulo 1: Acesso e Administração
##### Tela de Login: Interface para entrada de Usuário/E-mail e Senha, com autenticação processada no backend e proteção via JSON Web Token (JWT).
##### Painel de Administração: Área restrita para gestão do sistema, permitindo a adição de novos membros e a listagem de usuários já cadastrados no banco de dados.

#### 2.2 Módulo 2: Dashboard Principal (Visão Mensal)
##### (O ponto central da aplicação, com lógica voltada para o mês de referência selecionado.)
##### Navegação Temporal: Controles (anterior, atual, próximo) para alternar o escopo de visualização dos dados.
##### Cards de Resumo: Exibição em destaque do Total de Renda (Entradas), Total de Despesas (Saídas) e o Saldo Líquido resultante.
##### Visualização de Dados: 
###### – Gráfico de Pizza: Distribuição de despesas por Categoria.
###### – Gráfico de Barras: Comparativo direto entre Rendas vs. Despesas.
###### – Ranking: Listagem automática das 5 maiores despesas registradas no mês.

#### 2.3 Módulo 3: Gestão de Fluxo de Caixa (Rendas e Despesas)
##### Gerenciar Rendas: CRUD completo com campos de descrição, valor, tipo e data. A listagem deve ser filtrada dinamicamente pelo mês selecionado.
##### Gerenciar Despesas:
###### – Campos: Descrição, valor, data, categoria, número de parcelas e vínculo (Conta corrente ou Cartão de Crédito).
###### – Regra de Parcelamento: Para compras parceladas (n > 1), o sistema deve realizar a replicação automática da despesa para os meses subsequentes no banco de dados.
###### – Exportação: Funcionalidade de download da lista mensal em formato CSV.

#### 2.4 Módulo 4:Reservas e Investimentos
##### Minhas Reservas: Módulo focado na evolução do patrimônio guardado
##### Visualização: Gráfico de linha demonstrando o crescimento ou oscilaçãodas reservas ao longo do tempo.
##### CRUD de Aportes: Registro de novos valores, datas e a origem/fonte do recurso

#### 2.5 Módulo 5: Visão de Futuro e Cartões
##### Parcelamentos e Dívidas:
###### – Card consolidado com o somatório de todas as dívidas futuras.
###### – Cronograma de pagamentos detalhando o valor total devido em cada mês futuro.
###### – Visão de Fatura: Detalhamento técnico por cartão, apresentando o total da fatura e a lista de compras individuais vinculadas àquele período.
##### Gerenciar Cartões: CRUD para cadastro de cartões, coletando Nome, Tipo, Titular e os últimos 4 dígitos para identificação.

#### 2.6 Módulo 6: Relatórios Estratégicos
##### Relatório Financeiro Anual:
###### – Filtro seletor de Ano de Referência.
###### – Resumo Anual: Balanço consolidado de rendas, despesas e saldo final.
###### – Gráfico de Barras: Evolução mensal (Janeiro a Dezembro).
###### – Detalhamento: Lista de rendas do ano e agrupamento de despesas por conta/cartão.
###### – Exportação: Função para gerar o relatório final consolidado.

## 3 Requisitos Técnicos

#### 3.1 Arquitetura e Backend
##### Tecnologias: O projeto deve ser desenvolvido utilizando as tecnologias estudadas durante a disciplina, isto é, React/Node.js com o framework Next.js. 
##### Padrão MVC: O código deve ser organizado utilizando o padrão de Models, Controllers e Routes. 
##### Persistência: Implementação utilizando MongoDB com Mongoose. A modelagem deve permitir que despesas parceladas sejam consultadas individualmente por mês. 
##### Segurança: Hashing de senhas via bcryptjs e proteção de endpoints através de middlewares que validem o token JWT.

#### 3.2 Front-End e UX
##### Hooks: Uso obrigatório de useState para controle de estados locais/fluxos e useEffect para chamadas assíncronas à API. 
##### Gráficos: Implementaçãovisual através das bibliotecas Chart.js ou Recharts.

## 4 Dicas de Implementação

#### 4.1 Lógica de Parcelamento
##### Ao salvar uma despesa com n_parcelas > 1, o sistema deve gerar n registros no banco de dados.
##### Valor_Parcela = (Valor_Total) / (n_parcelas)
##### Utilize um laço de repetição no backend para incrementar o mês de cada registro subsequente. Recomenda-se o uso de um parcelaId único para agrupar estas transações.

#### 4.2 Navegação Temporal
##### Utilize um laço de repetição no backend para incrementar o mês de cada registro subsequente. Recomenda-se o uso de um parcelaId único para agrupar estas transações.
