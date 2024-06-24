import { createReadStream } from 'fs';
const newProfile={name: 'sora', checked: 'True', gender: 'male', comments: 'hello,this is sora', items: 3, age: 2, place: 'tokyo', image:' '};



// Dynamic import を使用して form-data と node-fetch をロード
async function sendFormData() {
    const FormData = await import('form-data');
    const fetch = (await import('node-fetch')).default; // .default が必要です

    const formData = new FormData(); 
    formData.append('name', 'sora');

    // 画像ファイルを追加する例、パスのバックスラッシュをエスケープ
    formData.append('image', createReadStream('C:\\Users\\sora0\\sns_django_react_frontend\\public\\images\\avatar\\dfl.png'));

    try {
        const response = await fetch('http://localhost:8000/api/user_profile/', {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            console.error("HTTP error", response.status, await response.text());
            return;
        }

        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error('Error:', error);
    }
}

sendFormData();
