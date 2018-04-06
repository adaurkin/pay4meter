
from smartz.api.constructor_engine import ConstructorInstance
from smartz.eth.contracts import make_generic_function_spec, merge_function_titles2specs


class Constructor(ConstructorInstance):

    def get_params(self):
        json_schema = {
            "type": "object",
            "required": [
                "name", "measurement", "unit", "price"
            ],
            "additionalProperties": False,

            "properties": {
                "name": {
                    "title": "Object",
                    "description": "Name or description of the object of rent (string of 200 chars max)",
                    "type": "string",
                    "minLength": 3,
                    "maxLength": 200,
                    "pattern": "^[a-zA-Z0-9,\. ]+$"
                },

                "measurement": {
                    "title": "Measurement",
                    "description": "What is measured (string of 200 chars max)",
                    "type": "string",
                    "minLength": 3,
                    "maxLength": 200,
                    "pattern": "^[a-zA-Z0-9,\. ]+$"
                },

                "unit": {
                    "title": "Measurement unit",
                    "description": "What is measurement unit (string of 20 chars max)",
                    "type": "string",
                    "minLength": 3,
                    "maxLength": 20,
                    "pattern": "^[a-zA-Z0-9,\. ]+$"
                },

                "price": {
                    "title": "Price of measurement unit",
                    "description": "How much ether one measurement unit costs (uint)",
                    "type": "number"
                }

            }
        }

        ui_schema = {}

        return {
            "result": "success",
            "schema": json_schema,
            "ui_schema": ui_schema
        }

    def construct(self, fields):

        source = self.__class__._TEMPLATE \
            .replace('%name%', fields['name']) \
            .replace('%measurement%', fields['measurement']) \
            .replace('%unit%', fields['unit']) \
            .replace('%price%', fields['price'])

        return {
            "result": "success",
            'source': source,
            'contract_name': "pay4meter"
        }

    def post_construct(self, fields, abi_array):

        # add later - after contract code
        function_titles = {
        }

        return {
            "result": "success",
            'function_specs': merge_function_titles2specs(make_generic_function_spec(abi_array), function_titles),
            'dashboard_functions': ['ballotName', 'getWinningVariantId', 'getWinningVariantName', 'getWinningVariantVotesCount']
        }


    # language=Solidity
    _TEMPLATE = """
pragma solidity ^0.4.18;

/**
 * @title Pay for Meter
 */
contract Pay4Meter {

}


    """
