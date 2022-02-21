/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePatient = /* GraphQL */ `
  subscription OnCreatePatient {
    onCreatePatient {
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
          sentiment_predominant
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
export const onUpdatePatient = /* GraphQL */ `
  subscription OnUpdatePatient {
    onUpdatePatient {
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
          sentiment_predominant
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
export const onDeletePatient = /* GraphQL */ `
  subscription OnDeletePatient {
    onDeletePatient {
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
          sentiment_predominant
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
export const onCreateNote = /* GraphQL */ `
  subscription OnCreateNote {
    onCreateNote {
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
      sentiment_predominant
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
export const onUpdateNote = /* GraphQL */ `
  subscription OnUpdateNote {
    onUpdateNote {
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
      sentiment_predominant
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
export const onDeleteNote = /* GraphQL */ `
  subscription OnDeleteNote {
    onDeleteNote {
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
      sentiment_predominant
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
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
        sentiment_predominant
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
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
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
        sentiment_predominant
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
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment {
    onDeleteComment {
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
        sentiment_predominant
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
