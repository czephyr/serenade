RESOURCE_NOT_FOUND = "Resource {_id} has not been found in {resource}"


class DuplicateCF(Exception):
    pass


class BadValues(ValueError):
    pass
