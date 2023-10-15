import os
import random
import subprocess
from util_scripts import cleanup_function


def create_test_case(param_count: int, min_val=1):
    unique_integers = []
    while len(unique_integers) < param_count:
        num = random.randint(min_val, param_count)
        if not num in unique_integers:
            unique_integers.append(num)

    if checker(unique_integers):
        unique_integers = create_test_case(param_count, min_val=1)
    return list(unique_integers)


def push_swap(origin: list[int], cmd_list: list[str]):
    stack_a = origin[:]
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

    return stack_a


def checker(stack: list[int]):
    prev = stack[0]
    for cur in stack[1:]:
        if prev <= cur:
            return False
        prev = cur
    return True


max_count = {
    3: 3,
    5: 12,
    100: 1500,
    500: 11500,
}


def test_push_swap(id: str, param_count: int):
    original_directory = os.getcwd()
    try:
        dir = os.path.join("repo", id)
        os.chdir(dir)

        origin_list = create_test_case(param_count)
        input_list = list(map(str, list(reversed(origin_list))))
        input_list.insert(0, "./push_swap")

        result = subprocess.run(
            input_list, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )
        answer_list = result.stdout.split("\n")
        answer_list.pop(-1)

        push_swap_result = push_swap(origin_list, answer_list)

        is_sorted = checker(push_swap_result)

        print("-------------------------------------")
        print("test_push_swap")
        print("origin : ", origin_list)
        print("result : ", push_swap_result)
        print("check  : ", is_sorted)
        print("count : ", len(answer_list))
        print("-------------------------------------")

        if is_sorted == True:
            if len(answer_list) <= max_count[param_count]:
                return {
                    "type": True,
                    "stdout": f"{param_count} Params Success : {len(answer_list)}",
                    "params": origin_list,
                    "answers": answer_list,
                }
            else:
                return {
                    "type": False,
                    "stdout": f"{param_count} Params Failed : {len(answer_list)}",
                    "params": origin_list,
                    "answers": answer_list,
                }
        else:
            cleanup_function(id)
            return {
                "type": False,
                "stdout": "Push swap test Failed",
                "params": origin_list,
                "answers": answer_list,
            }
    except FileNotFoundError:
        cleanup_function(id)
        return {
            "type": False,
            "stdout": "Cannot find push_swap",
        }
    except Exception as e:
        print(e)
        cleanup_function(id)
        return {"type": False, "stdout": result.stderr}
    finally:
        os.chdir(original_directory)
