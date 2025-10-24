# ⚙️ Configuração Local do Android

## 🔧 Java/JDK Setup

### Problema Comum

Se você ver erros como:
```
Value 'C:\Program Files\...' given for org.gradle.java.home is invalid
```

**Causa**: O arquivo `gradle.properties` contém um caminho hardcoded do Windows.

### ✅ Solução

1. **Use JAVA_HOME do sistema**:
   
   O Gradle detecta automaticamente o Java instalado através da variável `JAVA_HOME`.

2. **Configure JAVA_HOME (se necessário)**:

   **Windows**:
   ```powershell
   # PowerShell (Admin)
   [System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Eclipse Adoptium\jdk-21.0.8.9-hotspot', 'Machine')
   ```

   **macOS/Linux**:
   ```bash
   # Adicione ao ~/.bashrc ou ~/.zshrc
   export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home
   ```

3. **Verifique a instalação**:
   ```bash
   java -version
   echo $JAVA_HOME  # Linux/Mac
   echo %JAVA_HOME% # Windows CMD
   ```

### 📋 gradle.properties

O arquivo `android/gradle.properties` NÃO deve conter `org.gradle.java.home` com caminhos absolutos.

**❌ Errado** (não funciona no CI):
```properties
org.gradle.java.home=C:\\Program Files\\Eclipse Adoptium\\jdk-21.0.8.9-hotspot
```

**✅ Correto** (funciona local e CI):
```properties
org.gradle.java.installations.auto-detect=true
```

### 🏠 Configuração Local Opcional

Se você precisar usar um JDK específico localmente:

1. Copie o arquivo exemplo:
   ```bash
   cp android/gradle.properties.example android/gradle.properties.local
   ```

2. Edite `gradle.properties.local`:
   ```properties
   org.gradle.java.home=/seu/caminho/para/jdk
   ```

3. Use na linha de comando:
   ```bash
   cd android
   ./gradlew assembleRelease -Pgradle.properties=gradle.properties.local
   ```

## 🚀 CI/CD

O GitHub Actions configura automaticamente `JAVA_HOME` usando:

```yaml
- name: ☕ Setup Java
  uses: actions/setup-java@v4
  with:
    distribution: "temurin"
    java-version: ${{ env.JAVA_VERSION }}
```

Isso garante que o Gradle use o Java correto sem precisar de configurações hardcoded.

## 🔍 Debug

Para verificar qual Java o Gradle está usando:

```bash
cd android
./gradlew -version
```

Saída esperada:
```
Java:          21.0.8 (Eclipse Adoptium 21.0.8+9)
JVM:           OpenJDK 64-Bit Server VM (mixed mode, sharing)
OS:            Windows 11 10.0 amd64
```

## 📚 Referências

- [Gradle Java Toolchain](https://docs.gradle.org/current/userguide/toolchains.html)
- [Android Studio Java Configuration](https://developer.android.com/studio/intro/studio-config)
