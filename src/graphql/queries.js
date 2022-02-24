/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPatient = /* GraphQL */ `
  query GetPatient($id: ID!) {
    getPatient(id: $id) {
      id
      name
      notes {
        items {
          id
          title
          cuidadora_do_dia
          pressao
          saturacao
          temperatura
          manha_remedios_text
          manha_refeicao_text
          manha_higiene_text
          manha_atividade_text
          manha_humor_select
          tarde_remedios_text
          tarde_refeicao_text
          tarde_higiene_text
          tarde_atividade_text
          tarde_humor_select
          noite_remedios_text
          noite_refeicao_text
          noite_higiene_text
          noite_atividade_text
          noite_humor_select
          sentiment
          acontecimentos
          patientID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listPatients = /* GraphQL */ `
  query ListPatients(
    $filter: ModelPatientFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPatients(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        notes {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getNote = /* GraphQL */ `
  query GetNote($id: ID!) {
    getNote(id: $id) {
      id
      title
      cuidadora_do_dia
      pressao
      saturacao
      temperatura
      manha_remedios_text
      manha_refeicao_text
      manha_higiene_text
      manha_atividade_text
      manha_humor_select
      tarde_remedios_text
      tarde_refeicao_text
      tarde_higiene_text
      tarde_atividade_text
      tarde_humor_select
      noite_remedios_text
      noite_refeicao_text
      noite_higiene_text
      noite_atividade_text
      noite_humor_select
      sentiment
      acontecimentos
      patientID
      patient {
        id
        name
        notes {
          nextToken
        }
        createdAt
        updatedAt
      }
      comments {
        items {
          id
          noteID
          content
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listNotes = /* GraphQL */ `
  query ListNotes(
    $filter: ModelNoteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        cuidadora_do_dia
        pressao
        saturacao
        temperatura
        manha_remedios_text
        manha_refeicao_text
        manha_higiene_text
        manha_atividade_text
        manha_humor_select
        tarde_remedios_text
        tarde_refeicao_text
        tarde_higiene_text
        tarde_atividade_text
        tarde_humor_select
        noite_remedios_text
        noite_refeicao_text
        noite_higiene_text
        noite_atividade_text
        noite_humor_select
        sentiment
        acontecimentos
        patientID
        patient {
          id
          name
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      noteID
      note {
        id
        title
        cuidadora_do_dia
        pressao
        saturacao
        temperatura
        manha_remedios_text
        manha_refeicao_text
        manha_higiene_text
        manha_atividade_text
        manha_humor_select
        tarde_remedios_text
        tarde_refeicao_text
        tarde_higiene_text
        tarde_atividade_text
        tarde_humor_select
        noite_remedios_text
        noite_refeicao_text
        noite_higiene_text
        noite_atividade_text
        noite_humor_select
        sentiment
        acontecimentos
        patientID
        patient {
          id
          name
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        createdAt
        updatedAt
      }
      content
      createdAt
      updatedAt
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        noteID
        note {
          id
          title
          cuidadora_do_dia
          pressao
          saturacao
          temperatura
          manha_remedios_text
          manha_refeicao_text
          manha_higiene_text
          manha_atividade_text
          manha_humor_select
          tarde_remedios_text
          tarde_refeicao_text
          tarde_higiene_text
          tarde_atividade_text
          tarde_humor_select
          noite_remedios_text
          noite_refeicao_text
          noite_higiene_text
          noite_atividade_text
          noite_humor_select
          sentiment
          acontecimentos
          patientID
          createdAt
          updatedAt
        }
        content
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
