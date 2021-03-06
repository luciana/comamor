/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPatient = /* GraphQL */ `
  mutation CreatePatient(
    $input: CreatePatientInput!
    $condition: ModelPatientConditionInput
  ) {
    createPatient(input: $input, condition: $condition) {
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
          author
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
export const updatePatient = /* GraphQL */ `
  mutation UpdatePatient(
    $input: UpdatePatientInput!
    $condition: ModelPatientConditionInput
  ) {
    updatePatient(input: $input, condition: $condition) {
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
          author
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
export const deletePatient = /* GraphQL */ `
  mutation DeletePatient(
    $input: DeletePatientInput!
    $condition: ModelPatientConditionInput
  ) {
    deletePatient(input: $input, condition: $condition) {
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
          author
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
export const createNote = /* GraphQL */ `
  mutation CreateNote(
    $input: CreateNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    createNote(input: $input, condition: $condition) {
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
      author
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
export const updateNote = /* GraphQL */ `
  mutation UpdateNote(
    $input: UpdateNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    updateNote(input: $input, condition: $condition) {
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
      author
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
export const deleteNote = /* GraphQL */ `
  mutation DeleteNote(
    $input: DeleteNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    deleteNote(input: $input, condition: $condition) {
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
      author
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
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
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
        author
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
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
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
        author
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
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
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
        author
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
