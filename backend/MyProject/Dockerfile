FROM python:3.13.3

# Tạo thư mục làm việc
WORKDIR /code

# Copy requirements trước để tận dụng cache
COPY requirements.txt .

# Cài pip và các thư viện
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy toàn bộ source code
COPY . .

# Mở port 8000
EXPOSE 8000

# Lệnh chạy Daphne server
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "MyProject.asgi:application"]
