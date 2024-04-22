import os


class Euler:
    def __init__(self, N: int, e: int) -> None:
        """Create a Euler cypher object

        Args:
            N (int): module base, must be a prime number
            e (int): traslation key, should be prime or at least coprime with (N-1)
        """
        self.N = N
        self.__E = e
        self.__D = pow(e, -1, N - 1)

    def encrypt(self, value: int) -> int:
        return pow(value, self.__E, self.N)

    def decrypt(self, value: int) -> int:
        return pow(value, self.__D, self.N)


__BASE_KEY = int(os.environ.get("EULER_BASE_KEY", 2**64))
__SECRET_KEY = int(os.environ.get("EULER_SECRET_KEY", 1))
__CYPHER = Euler(__BASE_KEY, __SECRET_KEY)

