import { useEffect } from 'preact/hooks';
import "../styles/Sakura.css"; // 独立的样式文件

export default function Sakura({ count = 80 }) {
    useEffect(() => {
        for (let i = 0; i < count; i++) {
            const sakura = document.createElement("div");
            sakura.className = "sakura";
            sakura.style.left = Math.random() * 100 + "vw";
            sakura.style.animationDuration = 5 + Math.random() * 5 + "s";
            sakura.style.animationDelay = Math.random() * 5 + "s";
            sakura.style.transform = `scale(${0.5 + Math.random()})`;
            sakura.textContent = "🌸"; // 用樱花符号
            document.body.appendChild(sakura);
        }
    }, [count]);

    return null; // 只是往 body 插入，不渲染 UI
}
