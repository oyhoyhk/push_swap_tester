import os
import subprocess
import random


def test_no_param(id: str):
    original_directory = os.getcwd()
    try:
        dir = os.path.join("repo", id)
        os.chdir(dir)
        os.chmod(os.path.join(os.getcwd(), "push_swap"), 0o755)

        result = subprocess.run(
            ["./push_swap"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

        if len(result.stdout) == 0:
            return {"type": True, "msg": "No param test Success"}
    except FileNotFoundError:
        return {"type": False, "msg": "No param test Failed"}
    except Exception as e:
        return {"type": False, "msg": "No param test Failed"}
    finally:
        os.chdir(original_directory)


invalid_param_testcases = [
    ["./push_swap", "test"],
    ["./push_swap", "a", "2", "5", "3", "6"],
    ["./push_swap", "525a"],
    ["./push_swap", "$@#$123"],
    ["./push_swap", "\n"],
]


def test_invalid_params(id: str):
    original_directory = os.getcwd()
    try:
        dir = os.path.join("repo", id)
        os.chdir(dir)

        for testcase in invalid_param_testcases:
            result = subprocess.run(
                testcase,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            if result.stdout != "Error\n":
                return {"type": False, "msg": "Invalid params test Failed"}
        return {"type": True, "msg": "Invalid params test Success"}
    except FileNotFoundError:
        return {"type": False, "msg": "Invalid params test Failed"}
    except Exception as e:
        return {"type": False, "msg": "Invalid params test Failed"}
    finally:
        os.chdir(original_directory)


duplicated_params_testcases = [
    ["./push_swap", "1", "1"],
    ["./push_swap", "5", "4", "2", "3", "3"],
    ["./push_swap", "100", "100", "100", "100", "100"],
    ["./push_swap", "5", "5", "4", "4", "3", "3"],
    ["./push_swap", "-1", "-1", "-2", "-2", "-3"],
]


def test_param_duplication(id: str):
    original_directory = os.getcwd()
    try:
        dir = os.path.join("repo", id)
        os.chdir(dir)

        for testcase in duplicated_params_testcases:
            result = subprocess.run(
                testcase,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            if result.stdout != "Error\n":
                return {"type": False, "msg": "Duplicated params test Failed"}
        return {"type": True, "msg": "Duplicated params test Success"}
    except FileNotFoundError:
        return {"type": False, "msg": "Duplicated params test Failed"}
    except Exception as e:
        return {"type": False, "msg": "Duplicated params test Failed"}
    finally:
        os.chdir(original_directory)


def create_test_case(param_count: int, min_val=1, max_val=500):
    if param_count > (max_val - min_val + 1):
        raise ValueError("Cannot generate n unique integers in the given range.")

    unique_integers = set()
    while len(unique_integers) < param_count:
        num = random.randint(min_val, max_val)
        char = chr(num)
        unique_integers.add(char)

    return list(unique_integers)


def test_push_swap(id: str, param_count: int):
    original_directory = os.getcwd()
    try:
        dir = os.path.join("repo", id)
        os.chdir(dir)

        list = create_test_case(param_count)
        list.insert(0, "./push_swap")

        print("list")
        for target in list:
            print(target)
        result = subprocess.run(
            list, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )
        print("push_swap_test")
        print(result.stdout)
        # for testcase in duplicated_params_testcases:
        #     result = subprocess.run(
        #         testcase,
        #         stdout=subprocess.PIPE,
        #         stderr=subprocess.PIPE,
        #         text=True,
        #     )
        #     if result.stdout != "Error\n":
        #         return {"type": False, "msg": "Duplicated params test Failed"}
        return {"type": True, "msg": "Duplicated params test Success"}
    except FileNotFoundError:
        return {"type": False, "msg": "Duplicated params test Failed"}
    except Exception as e:
        return {"type": False, "msg": "Duplicated params test Failed"}
    finally:
        os.chdir(original_directory)


if __name__ == "__main__":
    print("test_no_params")
    test_no_param("42YerevansProjects")
    print(test_invalid_params("42YerevansProjects"))
    print(test_param_duplication("42YerevansProjects"))
    test_push_swap("42YerevansProjects", 5)
