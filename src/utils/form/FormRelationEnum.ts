interface Message {
    code: string; 
    msg: string;
}

interface FormRelationEnumType {
    /**
     * 字段已存在
     */
    FIELD_ALREADY_EXISTS(msg: string): Message;
}

export const FormRelationEnum: FormRelationEnumType = {
    FIELD_ALREADY_EXISTS: function(msg) {return {code: "C-FR-10001", msg: msg}} 
}

