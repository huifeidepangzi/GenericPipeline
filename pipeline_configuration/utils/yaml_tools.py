import yaml
import json


def yaml_to_json(yaml_str: str) -> str:
    # Parse YAML string
    yaml_data = yaml.safe_load(yaml_str)

    # Convert to JSON
    json_data = json.dumps(yaml_data)

    return json_data