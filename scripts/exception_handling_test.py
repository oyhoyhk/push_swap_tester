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


def create_test_case(param_count: int, min_val=1):
    unique_integers = set()
    while len(unique_integers) < param_count:
        num = random.randint(min_val, param_count)

        print("create test case", num)
        unique_integers.add(num)

    return list(unique_integers)


def push_swap(stack_a: list[int], cmd_list: list[str]):
    stack_b = []

    for cmd in cmd_list:
        if cmd == "sa":
            if len(stack_a) >= 2:
                stack_a[-1], stack_a[-2] = stack_a[-2], stack_a[-1]
        elif cmd == "sb":
            if len(stack_b) >= 2:
                stack_b[-1], stack_b[-2] = stack_b[-2], stack_b[-1]
        elif cmd == "ss":
            if len(stack_a) >= 2:
                stack_a[-1], stack_a[-2] = stack_a[-2], stack_a[-1]
            if len(stack_b) >= 2:
                stack_b[-1], stack_b[-2] = stack_b[-2], stack_b[-1]
        elif cmd == "ra":
            tmp = stack_a.pop()
            stack_a.insert(0, tmp)
        elif cmd == "rb":
            tmp = stack_b.pop()
            stack_b.insert(0, tmp)
        elif cmd == "rr":
            tmp = stack_a.pop()
            stack_a.insert(0, tmp)
            tmp = stack_b.pop()
            stack_b.insert(0, tmp)
        elif cmd == "rra":
            tmp = stack_a.pop(0)
            stack_a.append(tmp)
        elif cmd == "rrb":
            tmp = stack_b.pop(0)
            stack_b.append(tmp)
        elif cmd == "rrr":
            tmp = stack_a.pop(0)
            stack_a.append(tmp)
            tmp = stack_b.pop(0)
            stack_b.append(tmp)
        elif cmd == "pa":
            if len(stack_b) > 0:
                tmp = stack_b.pop()
                stack_a.append(tmp)
        elif cmd == "pb":
            if len(stack_a) > 0:
                tmp = stack_a.pop()
                stack_b.append(tmp)


def checker(stack: list[int]):
    for num in stack:
        print(num)


def test_push_swap(id: str, param_count: int):
    original_directory = os.getcwd()
    try:
        dir = os.path.join("repo", id)
        os.chdir(dir)

        origin_list = create_test_case(param_count)
        for item in origin_list:
            print("origin_list", item)
        input_list = list(map(str, origin_list))
        for item in input_list:
            print("input_list", item)
        input_list.insert(0, "./push_swap")

        result = subprocess.run(
            input_list, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )
        answer_list = result.stdout.split("\n")
        answer_list.pop(-1)

        push_swap(origin_list, answer_list)

        print(result.stdout)
        print("push_swap_result")
        checker(origin_list)

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
    test_push_swap("42YerevanProjects", 25)
